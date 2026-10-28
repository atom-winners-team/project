import { ACTIONS, assertAssignee, assertCan } from '../auth/permissions.js';
import { AppError } from '../errors/AppError.js';
import { NotFoundError } from '../errors/NotFound.js';
import { STATUSES } from '../models/constants.js';
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
const scheduleFields = new Set(['priority_id', 'planned_at']);
const workTransitions = {
  [STATUSES.new]: new Set([STATUSES.in_progress]),
  [STATUSES.in_progress]: new Set([STATUSES.waiting_parts]),
  [STATUSES.waiting_parts]: new Set([STATUSES.in_progress]),
};
const closeFrom = new Set([STATUSES.in_progress, STATUSES.waiting_parts]);

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

const assertScheduleUpdate = (data) => {
  const fields = Object.keys(data);
  if (fields.length === 0) {
    throw badRequest('Передайте срок или приоритет');
  }

  if (fields.some((field) => !scheduleFields.has(field))) {
    throw badRequest('Можно изменить только срок и приоритет');
  }
};

const summarize = (requests) => {
  const byStatus = Object.fromEntries(
    [...requestStatuses].map((status) => [status, 0]),
  );
  const workload = new Map();

  for (const request of requests) {
    if (byStatus[request.status] !== undefined) {
      byStatus[request.status] += 1;
    }

    if (request.status === STATUSES.done || request.status === STATUSES.rejected) {
      continue;
    }

    const assigneeId = request.assignee_id ?? null;
    const current = workload.get(assigneeId) ?? {
      assignee_id: assigneeId,
      open: 0,
    };
    current.open += 1;
    workload.set(assigneeId, current);
  }

  return {
    byStatus,
    workload: [...workload.values()],
  };
};

export const requestService = {
  async getAll(query = {}, user) {
    assertCan(user, ACTIONS.viewRequests);
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

  async getById(id, user) {
    assertCan(user, ACTIONS.viewRequests);
    return getRequestOrThrow(id);
  },

  async getSummary(user) {
    assertCan(user, ACTIONS.viewSummary, 'Сводка доступна только директору');
    return summarize(await requestRepository.findAll());
  },

  async create(data, user) {
    assertCan(user, ACTIONS.createRequest, 'Создавать заявки может только дежурный');
    validateData(data);
    validateType(data.type);

    const values = pickRequestFields(data);
    values.author_id = getActorId(user);

    return requestRepository.create(values);
  },

  async update(id, data, user) {
    assertCan(
      user,
      ACTIONS.updateSchedule,
      'Менять срок и приоритет может только директор',
    );
    validateData(data);
    const values = pickRequestFields(data);
    assertScheduleUpdate(values);

    const request = await getRequestOrThrow(id);
    return requestRepository.update(request, values);
  },

  async assign(id, data, user) {
    assertCan(
      user,
      ACTIONS.assignRequest,
      'Назначать исполнителя может только директор',
    );
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

  async changeStatus(id, data, user) {
    validateData(data);
    validateStatus(data.status);

    const request = await getRequestOrThrow(id);
    const nextStatus = data.status;

    if (nextStatus === STATUSES.done) {
      assertCan(
        user,
        ACTIONS.closeOwnRequest,
        'Закрывать заявку может только инженер',
      );
      assertAssignee(user, request);

      if (!closeFrom.has(request.status)) {
        throw badRequest('Закрыть можно заявку в работе или в ожидании ЗИП');
      }

      const comment = typeof data.comment === 'string' ? data.comment.trim() : '';
      if (!comment) {
        throw badRequest('Чтобы закрыть заявку, укажите комментарий');
      }

      return requestRepository.update(request, {
        status: STATUSES.done,
        close_comment: comment,
      });
    }

    assertCan(
      user,
      ACTIONS.changeOwnWorkStatus,
      'Менять статус работы может только инженер',
    );
    assertAssignee(user, request);

    const allowed = workTransitions[request.status];
    if (!allowed?.has(nextStatus)) {
      throw badRequest('Недопустимый переход статуса');
    }

    return requestRepository.update(request, { status: nextStatus });
  },
};
