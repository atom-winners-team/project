import db from '../models/index.js';

const { User } = db;

export const findById = async (id) => {
  return User.findByPk(id);
};

export const findByLogin = async (login) => {
  return User.findOne({ where: { login } });
};

export const findAll = async () => {
  return User.findAll();
};

export const create = async (data) => {
  return User.create(data);
};
