import { AppError } from '../errors/AppError.js';
import { NotFoundError } from '../errors/NotFound.js';
import * as requestRepository from '../repositories/requestRepository.js';
import * as userRepository from '../repositories/userRepository.js';

const requestTypes = new Set(['inspection', 'repair']);
const requestStatuses = new Set([
  'new',
  'in_progress',
  'waiting_parts',
  'done',
  'rejected',
]);
const requestFields = [
  'equipment_id',
  'type',
  'priority_id',
  'description',
  'planned_at',
  'snapshot_context',
];

const badRequest = (message) => new AppError(message, 400, 'INVALID_REQUEST');

const validateData = (data) => {
  if (data === null || typeof data !== 'object' || Array.isArray(data)) {
    throw badRequest('Данные заявки должны быть объектом');
  }
};

const validateType = (type) => {
  if (!requestTypes.has(type)) {
    throw badRequest('Тип заявки должен быть inspection или repair');
  }
};

const validateStatus = (status) => {
  if (!requestStatuses.has(status)) {
    throw badRequest('Недопустимый статус заявки');
  }
};

const getActorId = (user) => user?.id ?? user?.userId ?? user?.sub ?? null;

const getRequestOrThrow = async (id) => {
  const request = await requestRepository.findById(id);

  if (!request) {
    throw new NotFoundError('Заявка не найдена');
  }

  return request;
};

const pickRequestFields = (data) => {
  const values = {};

  for (const field of requestFields) {
    if (Object.hasOwn(data, field)) {
      values[field] = data[field];
    }
  }

  return values;
};

export const requestService = {
  async getAll(query = {}) {
    validateData(query);

    const where = {};
    for (const field of [
      'status',
      'type',
      'equipment_id',
      'priority_id',
      'author_id',
      'assignee_id',
    ]) {
      if (query[field] !== undefined) {
        where[field] = query[field];
      }
    }

    if (where.type !== undefined) {
      validateType(where.type);
    }

    if (where.status !== undefined) {
      validateStatus(where.status);
    }

    return requestRepository.findAll(where);
  },

  async getById(id) {
    return requestRepository.findById(id);
  },

  async create(data, user) {
    validateData(data);
    validateType(data.type);

    const values = pickRequestFields(data);
    values.author_id = getActorId(user);

    return requestRepository.create(values);
  },

  async update(id, data) {
    validateData(data);
    const request = await getRequestOrThrow(id);
    const values = pickRequestFields(data);

    if (Object.hasOwn(values, 'type')) {
      validateType(values.type);
    }

    return requestRepository.update(request, values);
  },

  async assign(id, data) {
    validateData(data);
    if (!Object.hasOwn(data, 'assignee_id')) {
      throw badRequest('Не указан исполнитель заявки');
    }

    const request = await getRequestOrThrow(id);
    const assigneeId = data.assignee_id;

    if (assigneeId !== null) {
      const assignee = await userRepository.findById(assigneeId);
      if (!assignee) {
        throw new NotFoundError('Исполнитель не найден');
      }
    }

    return requestRepository.update(request, { assignee_id: assigneeId });
  },

  async changeStatus(id, data) {
    validateData(data);
    validateStatus(data.status);

    const request = await getRequestOrThrow(id);
    return requestRepository.update(request, { status: data.status });
  },
};
