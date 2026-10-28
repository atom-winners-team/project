import * as userService from '../services/userService.js';

export const getAll = async (_req, res, next) => {
  try {
    res.status(200).json(await userService.getAll());
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    res.status(200).json(await userService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await userService.create(req.body));
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    res.status(200).json(await userService.update(req.params.id, req.body));
  } catch (error) {
    next(error);
  }
};

export const deleteById = async (req, res, next) => {
  try {
    await userService.remove(req.params.id);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
