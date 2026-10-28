import xlsx from 'xlsx';
import fs from 'node:fs';
import * as equipmentRepository from '../repositories/equipmentRepository.js';
import { NotFoundError } from '../errors/NotFound.js';

export const getAll = () => equipmentRepository.findAll();
export const getUnmatchedHistory = () => equipmentRepository.findUnmatchedHistory();

export async function getById(id) {
  const equipment = await equipmentRepository.findById(id);

  if (!equipment) {
    throw new NotFoundError('Оборудование не найдено');
  }

  return equipment;
}

export async function getHistory(id) {
  const equipment = await equipmentRepository.findById(id);

  if (!equipment) {
    throw new NotFoundError('Оборудование не найдено');
  }

  return equipmentRepository.getHistoryByEquipmentId(id);
}

function findSheets(names) {
  let registry = names[0];
  let history = names[1];

  for (const name of names) {
    const lower = name.toLowerCase();

    if (lower.includes('реестр') || lower.includes('registry')) {
      registry = name;
    }

    if (lower.includes('истор') || lower.includes('history')) {
      history = name;
    }
  }

  return { registry, history };
}

function readRows(workbook, sheetName) {
  if (!sheetName) {
    return [];
  }

  return xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], {
    defval: null
  });
}

function normalizeId(value) {
  return value === null || value === undefined
      ? null
      : String(value).trim();
}

function readLoadingId(row, allowIdFallback = false) {
  const columns = Object.keys(row);

  let column = columns.find((name) => {
    const lower = name.toLowerCase();

    return lower.includes('идентифик') && lower.includes('загруз');
  });

  let original = column === undefined ? null : row[column];
  let key = normalizeId(original);

  if (!key && allowIdFallback) {
    column = columns.find((name) => name.toLowerCase().includes('id'));

    if (column !== undefined) {
      original = row[column];
      key = normalizeId(original);
    }
  }

  return { key, original };
}

export async function importFromFixedBook(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error('Book file not found');
  }

  const workbook = xlsx.readFile(filePath);
  const sheets = findSheets(workbook.SheetNames);

  const result = {
    matched: 0,
    unmatched: 0,
    createdEquipment: 0,
    contextOnly: 0,
  };

  for (const row of readRows(workbook, sheets.registry)) {
    const { key, original } = readLoadingId(row);

    if (key && await equipmentRepository.findByLoadingIdString(key)) {
      continue;
    }

    await equipmentRepository.create({
      loadingId: key || null,
      loadingIdOriginal: key ? original : null,
      name: row['Наименование'] || row.name || row['Название'] || null,
      attributes: row,
      rawRow: row,
      isContextOnly: !key,
    });

    if (key) {
      result.createdEquipment += 1;
    } else {
      result.contextOnly += 1;
    }
  }

  for (const row of readRows(workbook, sheets.history)) {
    const { key, original } = readLoadingId(row, true);

    const equipment = key
        ? await equipmentRepository.findByLoadingIdString(key)
        : null;

    await equipmentRepository.createHistory({
      equipmentId: equipment ? equipment.id : null,
      loadingIdKey: key || null,
      loadingIdOriginal: key ? original : null,
      raw: row,
      isUnmatched: !equipment,
    });

    if (equipment) {
      result.matched += 1;
    } else {
      result.unmatched += 1;
    }
  }

  await equipmentRepository.createImportReport({
    unmatchedCount: result.unmatched,
    unmatchedMissingIdsCount: result.unmatched,
    matchedCount: result.matched,
    report: result,
  });

  return result;
}
