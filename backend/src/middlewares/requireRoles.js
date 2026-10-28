import { ForbiddenError } from "../errors/ForbiddenError.js";

export const requireRoles = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user?.role)) {
    next(new ForbiddenError());
    return;
  }

  next();
};
