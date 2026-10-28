import { importFromFixedBook } from '../services/equipmentImportService.js';
import db from '../models/index.js';

const { Equipment, EquipmentHistory, EquipmentImportReport } = db;

export const importBook = async (req, res) => {
  try {
    const filePath = req.body?.filePath || req.query?.filePath;
    if (!filePath) {
      return res.status(400).json({ message: 'filePath required' });
    }
    const result = await importFromFixedBook(filePath);
    return res.json({ result });
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

export const getRegistry = async (req, res) => {
  const items = await Equipment.findAll({ order: [['id', 'ASC']] });
  return res.json(items);
};

export const getEquipmentWithHistory = async (req, res) => {
  const { id } = req.params;
  const equipment = await Equipment.findByPk(id);
  if (!equipment) return res.status(404).json({ message: 'not found' });
  const history = await EquipmentHistory.findAll({ where: { equipmentId: id }, order: [['id', 'ASC']] });
  return res.json({ equipment, history });
};

export const getImportReports = async (req, res) => {
  const reports = await EquipmentImportReport.findAll({ order: [['id', 'DESC']], limit: 10 });
  return res.json(reports);
};

export const getUnmatchedHistory = async (req, res) => {
  const items = await EquipmentHistory.findAll({ where: { isUnmatched: true }, order: [['id', 'ASC']] });
  return res.json(items);
};
