import db from '../models/index.js';

const { User } = db;

export const findById = async (id) => {
  return User.findByPk(id);
};

export const findByUsername = async (username) => {
  return User.findOne({ where: { username } });
};

export const findAll = async () => {
  return User.findAll();
};

export const create = async (data) => {
  return User.create(data);
};
