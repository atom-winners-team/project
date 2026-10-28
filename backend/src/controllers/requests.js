
import * as requestsService from "../services/requests.js";

export const getAll = async (req, res, next) => {
  try {
    const requests = await requestsService.getAll(req.query);

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const request = await requestsService.getById(
      req.params.id
    );

    if (!request) {
      return res.status(404).json({
        message: "Заявка не найдена",
      });
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const request = await requestsService.create(
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
    const request = await requestsService.update(
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
    const request = await requestsService.assign(
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
    const request = await requestsService.changeStatus(
      req.params.id,
      req.body,
      req.user
    );

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};
