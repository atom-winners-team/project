import { NotFoundError } from "../errors/NotFound.js";
import * as requestRepository from "../repositories/requestRepository.js";

const getAuthorId = (user) => user?.id ?? user?.userId ?? user?.sub ?? null;

const getRequestOrRespond = async (id, next) => {
  const request = await requestRepository.findById(id);

  if (!request) {
    next(new NotFoundError("Заявка не найдена"));
    return null;
  }

  return request;
};

export const getAll = async (req, res, next) => {
  try {
    const requests = await requestRepository.findAll();

    res.status(200).json(requests);
  } catch (error) {
    next(error);
  }
};

export const getById = async (req, res, next) => {
  try {
    const request = await getRequestOrRespond(req.params.id, next);

    if (!request) {
      return;
    }

    res.status(200).json(request);
  } catch (error) {
    next(error);
  }
};

export const create = async (req, res, next) => {
  try {
    const request = await requestRepository.create({
      ...req.body,
      author_id: getAuthorId(req.user),
    });

    res.status(201).json(request);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const request = await getRequestOrRespond(req.params.id, next);

    if (!request) {
      return;
    }

    const updated = await requestRepository.update(request, req.body);

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const assign = async (req, res, next) => {
  try {
    const request = await getRequestOrRespond(req.params.id, next);

    if (!request) {
      return;
    }

    const updated = await requestRepository.update(request, {
      assignee_id: req.body.assignee_id,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const changeStatus = async (req, res, next) => {
  try {
    const request = await getRequestOrRespond(req.params.id, next);

    if (!request) {
      return;
    }

    const updated = await requestRepository.update(request, {
      status: req.body.status,
    });

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};
