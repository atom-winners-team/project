import db from '../models/index.js';

const { Request } = db;

export const findAll = async (where = {}) => {
  return Request.findAll({
    where,
    order: [['createdAt', 'DESC']],
  });
};

export const findById = async (id) => {
  return Request.findByPk(id);
};

export const create = async (data) => {
  return Request.create(data);
};

export const update = async (request, data) => {
  return request.update(data);
};
