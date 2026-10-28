import db from '../models/index.js';

const { Equipment, EquipmentHistory, EquipmentImportReport } = db;

export const findByLoadingIdString = async (loadingId) => {
  if (loadingId === null || loadingId === undefined) {
    return null;
  }
  const key = String(loadingId);
  return Equipment.findOne({
    where: { loadingId: key },
  });
};

export const findById = async (id) => {
  return Equipment.findByPk(id);
};

export const findAll = async () => {
  return Equipment.findAll({ order: [['id', 'ASC']] });
};

export const create = async (data) => {
  return Equipment.create(data);
};

export const bulkCreate = async (rows) => {
  return Equipment.bulkCreate(rows);
};

export const getHistoryByEquipmentId = async (equipmentId) => {
  return EquipmentHistory.findAll({ where: { equipmentId }, order: [['id', 'ASC']] });
};

export const findUnmatchedHistory = async () => {
  return EquipmentHistory.findAll({
    where: { isUnmatched: true },
    order: [['id', 'ASC']],
  });
};

export const createHistory = async (data) => {
  return EquipmentHistory.create(data);
};

export const createImportReport = async (data) => {
  return EquipmentImportReport.create(data);
};
