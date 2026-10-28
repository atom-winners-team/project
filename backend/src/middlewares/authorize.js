import { assertCan } from '../auth/permissions.js';

export const requireAction = (action, message) => (req, _res, next) => {
  try {
    assertCan(req.user, action, message);
    next();
  } catch (error) {
    next(error);
  }
};
