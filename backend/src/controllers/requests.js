
import { requestService } from "../services/request.js";

export const getAll = async (req, res, next) => {
  try {
    const requests = await requestService.getAll(req.query);

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const request = await requestService.getById(
      req.params.id
    );

    if (!request) {
        return next(new NotFoundError("Заявка не найдена"));
      }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const request = await requestService.create(
      req.body,
      req.user
    );

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const request = await requestService.update(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};


export const assign = async (req, res, next) => {
  try {
    const request = await requestService.assign(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const request = await requestService.changeStatus(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};