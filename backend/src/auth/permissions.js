import { ForbiddenError } from '../errors/ForbiddenError.js';
import { USER_ROLES } from '../models/constants.js';

export const ACTIONS = {
  viewEquipment: 'viewEquipment',
  viewRequests: 'viewRequests',
  createRequest: 'createRequest',
  assignRequest: 'assignRequest',
  updateSchedule: 'updateSchedule',
  changeOwnWorkStatus: 'changeOwnWorkStatus',
  closeOwnRequest: 'closeOwnRequest',
  viewSummary: 'viewSummary',
};

const ROLE_ACTIONS = {
  [USER_ROLES.duty]: new Set([
    ACTIONS.viewEquipment,
    ACTIONS.viewRequests,
    ACTIONS.createRequest,
  ]),
  [USER_ROLES.engineer]: new Set([
    ACTIONS.viewEquipment,
    ACTIONS.viewRequests,
    ACTIONS.changeOwnWorkStatus,
    ACTIONS.closeOwnRequest,
  ]),
  [USER_ROLES.director]: new Set([
    ACTIONS.viewEquipment,
    ACTIONS.viewRequests,
    ACTIONS.assignRequest,
    ACTIONS.updateSchedule,
    ACTIONS.viewSummary,
  ]),
};

export const assertCan = (user, action, message = 'Недостаточно прав') => {
  if (!ROLE_ACTIONS[user?.role]?.has(action)) {
    throw new ForbiddenError(message);
  }
};

export const assertAssignee = (user, request) => {
  if (
    request.assignee_id == null ||
    Number(request.assignee_id) !== Number(user?.id)
  ) {
    throw new ForbiddenError('Действие доступно только назначенному инженеру');
  }
};
