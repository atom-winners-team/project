import { requestService } from "../services/request.js";

export const getAll = async (req, res, next) => {
  try {
    res.status(200).json(await requestService.getAll(req.query, req.user));
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    res.status(200).json(await requestService.getById(req.params.id, req.user));
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    res.status(201).json(await requestService.create(req.body, req.user));
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    res.status(200).json(
      await requestService.update(req.params.id, req.body, req.user),
    );
  } catch (error) {
    next(error);
  }
};

export const assign = async (req, res, next) => {
  try {
    res.status(200).json(
      await requestService.assign(req.params.id, req.body, req.user),
    );
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    res.status(200).json(
      await requestService.changeStatus(req.params.id, req.body, req.user),
    );
  } catch (error) {
    next(error);
  }
};
