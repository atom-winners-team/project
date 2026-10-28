import db from '../models/index.js';

const { TelemetryUnit, TelemetryObservation } = db;

export const findUnitByKey = async (key) => {
  return TelemetryUnit.findOne({ where: { key } });
};

export const createUnit = async (data) => {
  return TelemetryUnit.create(data);
};

export const updateUnit = async (unit, data) => {
  return unit.update(data);
};

export const createObservation = async (data) => {
  return TelemetryObservation.create(data);
};

export const getObservations = async (unitId, limit = 100) => {
  return TelemetryObservation.findAll({
    where: { unitId },
    order: [['receiveTime', 'DESC']],
    limit,
  });
};
