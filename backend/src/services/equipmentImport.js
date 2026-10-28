import xlsx from 'xlsx';
import fs from 'node:fs';
import path from 'node:path';
import * as equipmentRepository from '../repositories/equipmentRepository.js';
import { AppError } from '../errors/AppError.js';
import { logger } from '../utils/logger.js';
import {
  EQUIPMENT_SHEET,
  HISTORY_SHEET,
  ID_COLUMN,
  NAME_COLUMN,
  EQUIPMENT_HEADERS,
  HISTORY_HEADERS,
} from '../constants/equipmentImport.js';

// читаем excel и сохраняем оборудование и историю
export const importFromFixedBook = async (filePath) => {
  const workbook = openExcel(filePath);
  const equipmentRows = readSheet(workbook, EQUIPMENT_SHEET, EQUIPMENT_HEADERS);
  const historyRows = readSheet(workbook, HISTORY_SHEET, HISTORY_HEADERS);

  const equipment = await saveEquipment(equipmentRows);
  const history = await saveHistory(historyRows, equipment.byLoadingId);

  const summary = {
    equipmentCount: equipment.equipmentCount,
    equipmentCreated: equipment.equipmentCreated,
    hierarchySkipped: equipment.hierarchySkipped,
    historyCount: historyRows.length,
    historyCreated: history.historyCreated,
    matchedCount: history.matchedCount,
    unmatchedCount: history.unmatchedCount,
    unmatchedMissingIdsCount: history.unmatchedMissingIdsCount,
  };

  const report = await equipmentRepository.createImportReport({
    unmatchedCount: summary.unmatchedCount,
    unmatchedMissingIdsCount: summary.unmatchedMissingIdsCount,
    matchedCount: summary.matchedCount,
    report: summary,
  });

  logger.info('Импорт оборудования завершён');

  return { ...summary, reportId: report.id };
};

function openExcel(filePath) {
  if (typeof filePath !== 'string' || filePath.trim() === '') {
    throw new AppError('Не указан путь к файлу Excel', 400);
  }

  const fullPath = path.resolve(filePath);

  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) {
    throw new AppError('Файл Excel не найден', 400);
  }

  try {
    return xlsx.readFile(fullPath, { cellDates: false });
  } catch {
    throw new AppError('Не удалось прочитать файл Excel', 400);
  }
}

function readSheet(workbook, sheetName, expectedHeaders) {
  const sheet = workbook.Sheets[sheetName];

  if (!sheet) {
    throw new AppError(`В книге нет листа «${sheetName}»`, 400);
  }

  const table = xlsx.utils.sheet_to_json(sheet, {
    header: 1,
    defval: null,
    raw: true,
    blankrows: false,
  });

  if (!table.length) {
    throw new AppError(`Лист «${sheetName}» пустой`, 400);
  }

  const headerRow = [];
  const firstRow = Array.isArray(table[0]) ? table[0] : [];

  for (const cell of firstRow) {
    headerRow.push(cell === null || cell === undefined ? '' : String(cell));
  }

  while (headerRow.length && headerRow[headerRow.length - 1] === '') {
    headerRow.pop();
  }

  if (headerRow.length !== expectedHeaders.length) {
    throw new AppError(`Неверные колонки на листе «${sheetName}»`, 400);
  }

  for (let i = 0; i < expectedHeaders.length; i += 1) {
    if (headerRow[i] !== expectedHeaders[i]) {
      throw new AppError(`Неверные колонки на листе «${sheetName}»`, 400);
    }
  }

  const rows = [];

  for (let rowIndex = 1; rowIndex < table.length; rowIndex += 1) {
    const cells = table[rowIndex];
    const row = {};
    let hasValue = false;

    for (let col = 0; col < expectedHeaders.length; col += 1) {
      let value = Array.isArray(cells) ? cells[col] : null;
      if (value === undefined || value === '') value = null;

      row[expectedHeaders[col]] = value;
      if (value !== null) hasValue = true;
    }

    // пустые строки не нужны
    if (hasValue) rows.push(row);
  }

  return rows;
}

// пустой id не считаем ключом, пробелы внутри текста не трогаем
function getLoadingId(value) {
  if (value === null || value === undefined) return null;

  const text = String(value);
  if (text.trim() === '') return null;

  return text;
}

function asText(value) {
  if (value === null || value === undefined) return null;
  return String(value);
}

// одинаковые записи сравниваем по строке, порядок ключей не важен
function historyKey(loadingIdKey, loadingIdOriginal, raw) {
  const sortedRaw = {};
  const keys = Object.keys(raw || {}).sort();

  for (const key of keys) {
    sortedRaw[key] = raw[key];
  }

  return JSON.stringify({
    loadingIdKey: loadingIdKey ?? null,
    loadingIdOriginal: loadingIdOriginal ?? null,
    raw: sortedRaw,
  });
}

async function saveEquipment(rows) {
  const existing = await equipmentRepository.findAll();
  const byLoadingId = new Map();

  for (const item of existing) {
    if (item.loadingId === null || item.loadingId === undefined) continue;
    byLoadingId.set(String(item.loadingId), item);
  }

  const idsInFile = new Set();
  let equipmentCreated = 0;
  let hierarchySkipped = 0;

  for (const row of rows) {
    const sourceId = row[ID_COLUMN];
    const loadingId = getLoadingId(sourceId);

    // строки иерархии без id не сохраняем как оборудование
    if (!loadingId) {
      hierarchySkipped += 1;
      continue;
    }

    idsInFile.add(loadingId);

    if (byLoadingId.has(loadingId)) continue;

    const name = row[NAME_COLUMN];
    const created = await equipmentRepository.create({
      loadingId,
      loadingIdOriginal: asText(sourceId),
      name: name === null || name === undefined ? null : String(name),
      attributes: row,
      rawRow: row,
      isContextOnly: false,
    });

    byLoadingId.set(loadingId, created);
    equipmentCreated += 1;
  }

  return {
    byLoadingId,
    equipmentCount: idsInFile.size,
    equipmentCreated,
    hierarchySkipped,
  };
}

async function saveHistory(rows, byLoadingId) {
  const alreadySaved = new Map();
  const seenHistoryIds = new Set();

  const remember = (historyRows) => {
    for (const historyRow of historyRows) {
      if (seenHistoryIds.has(historyRow.id)) continue;
      seenHistoryIds.add(historyRow.id);

      const key = historyKey(
        historyRow.loadingIdKey ?? null,
        historyRow.loadingIdOriginal ?? null,
        historyRow.raw ?? null,
      );
      alreadySaved.set(key, (alreadySaved.get(key) ?? 0) + 1);
    }
  };

  const seenEquipment = new Set();

  for (const equipment of byLoadingId.values()) {
    if (seenEquipment.has(equipment.id)) continue;
    seenEquipment.add(equipment.id);
    remember(await equipmentRepository.getHistoryByEquipmentId(equipment.id));
  }

  remember(await equipmentRepository.findUnmatchedHistory());

  let historyCreated = 0;
  let matchedCount = 0;
  let unmatchedCount = 0;
  let unmatchedMissingIdsCount = 0;

  for (const row of rows) {
    const sourceId = row[ID_COLUMN];
    const loadingId = getLoadingId(sourceId);
    const equipment = loadingId ? byLoadingId.get(loadingId) : null;

    if (!loadingId) unmatchedMissingIdsCount += 1;
    else if (!equipment) unmatchedCount += 1;
    else matchedCount += 1;

    const key = historyKey(loadingId, asText(sourceId), row);
    const savedCount = alreadySaved.get(key) ?? 0;

    // если такая запись уже есть, второй раз её не пишем
    if (savedCount > 0) {
      alreadySaved.set(key, savedCount - 1);
      continue;
    }

    await equipmentRepository.createHistory({
      equipmentId: equipment ? equipment.id : null,
      loadingIdKey: loadingId,
      loadingIdOriginal: asText(sourceId),
      raw: row,
      isUnmatched: !equipment,
    });

    historyCreated += 1;
  }

  return {
    historyCreated,
    matchedCount,
    unmatchedCount,
    unmatchedMissingIdsCount,
  };
}
