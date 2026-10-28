import xlsx from 'xlsx';
import fs from 'fs';
import db from '../models/index.js';

const { Equipment, EquipmentHistory, EquipmentImportReport } = db;

function normalizeKey(val) {
  if (val === null || val === undefined) return null;
  return String(val).trim();
}

export const importFromFixedBook = async (filePath) => {
  if (!fs.existsSync(filePath)) {
    throw new Error('Book file not found');
  }
  const workbook = xlsx.readFile(filePath);
  const result = {
    matched: 0,
    unmatched: 0,
    createdEquipment: 0,
    contextOnly: 0,
  };

  const sheets = workbook.SheetNames;
  let registrySheet = null;
  let historySheet = null;
  for (const name of sheets) {
    const lower = name.toLowerCase();
    if (lower.includes('реестр') || lower.includes('registry')) registrySheet = name;
    if (lower.includes('истор') || lower.includes('history')) historySheet = name;
  }
  if (!registrySheet && sheets.length > 0) registrySheet = sheets[0];
  if (!historySheet && sheets.length > 1) historySheet = sheets[1];

  if (registrySheet) {
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[registrySheet], { defval: null });
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      let loadingId = null;
      let loadingIdOriginal = null;
      for (const [k, v] of Object.entries(row)) {
        if (typeof k === 'string') {
          const kl = k.toLowerCase();
          if (kl.includes('идентифик') && kl.includes('загруз')) {
            loadingIdOriginal = v;
            loadingId = normalizeKey(v);
            break;
          }
        }
      }
      if (loadingId) {
        const exists = await Equipment.findOne({ where: { loadingId } });
        if (!exists) {
          await Equipment.create({
            loadingId,
            loadingIdOriginal,
            name: row['Наименование'] || row['name'] || row['Название'] || null,
            attributes: row,
            rawRow: row,
            isContextOnly: false,
          });
          result.createdEquipment += 1;
        }
      } else {
        await Equipment.create({
          loadingId: null,
          loadingIdOriginal: null,
          name: row['Наименование'] || row['name'] || row['Название'] || null,
          attributes: row,
          rawRow: row,
          isContextOnly: true,
        });
        result.contextOnly += 1;
      }
    }
  }

  if (historySheet) {
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[historySheet], { defval: null });
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      let loadingId = null;
      let loadingIdOriginal = null;
      for (const [k, v] of Object.entries(row)) {
        if (typeof k === 'string') {
          const kl = k.toLowerCase();
          if (kl.includes('идентифик') && kl.includes('загруз')) {
            loadingIdOriginal = v;
            loadingId = normalizeKey(v);
            break;
          }
        }
      }
      if (!loadingId) {
        for (const [k, v] of Object.entries(row)) {
          if (typeof k === 'string' && k.toLowerCase().includes('id')) {
            loadingIdOriginal = v;
            loadingId = normalizeKey(v);
            break;
          }
        }
      }
      if (loadingId) {
        const eq = await Equipment.findOne({ where: { loadingId } });
        if (eq) {
          await EquipmentHistory.create({
            equipmentId: eq.id,
            loadingIdKey: loadingId,
            loadingIdOriginal,
            raw: row,
            isUnmatched: false,
          });
          result.matched += 1;
        } else {
          await EquipmentHistory.create({
            equipmentId: null,
            loadingIdKey: loadingId,
            loadingIdOriginal,
            raw: row,
            isUnmatched: true,
          });
          result.unmatched += 1;
        }
      } else {
        await EquipmentHistory.create({
          equipmentId: null,
          loadingIdKey: null,
          loadingIdOriginal: null,
          raw: row,
          isUnmatched: true,
        });
        result.unmatched += 1;
      }
    }
  }

  await EquipmentImportReport.create({
    unmatchedCount: result.unmatched,
    unmatchedMissingIdsCount: result.unmatched,
    matchedCount: result.matched,
    report: result,
  });

  return result;
};
