import db from '../models/index.js';

const { User } = db;

export const findById = async (id) => {
  return User.findByPk(id);
};

export const findByUsername = async (username) => {
  return User.findOne({
    where: { login: username },
  });
}
export const findByLogin = async (login) => {
  return User.findOne({ where: { login } });
};

export const findAll = async () => {
  return User.findAll();
};

export const create = async (data) => {
  return User.create(data);
};

export const update = async (id, data) => {
  const [updatedCount, users] = await User.update(data, {
    where: { id },
    returning: true,
  });

  if (updatedCount === 0) {
    return null;
  }

  return users[0];
};

export const remove = async (id) => {
  return User.destroy({
    where: { id },
  });
};