import { Router } from "express";
import * as requestsController from "../controllers/requests.js";
import { USER_ROLES } from "../models/constants.js";
import { requireRoles } from "../middlewares/requireRoles.js";

const router = Router();

router.use(
  requireRoles(USER_ROLES.duty, USER_ROLES.director, USER_ROLES.engineer),
);

router.get("/", requestsController.getAll);
router.get("/:id", requestsController.getById);
router.post(
  "/",
  requireRoles(USER_ROLES.duty, USER_ROLES.director),
  requestsController.create,
);
router.patch(
  "/:id",
  requireRoles(USER_ROLES.duty, USER_ROLES.director),
  requestsController.update,
);
router.post(
  "/:id/assign",
  requireRoles(USER_ROLES.duty, USER_ROLES.director),
  requestsController.assign,
);
router.post("/:id/status", requestsController.changeStatus);

export default router;

// тут ловим запросы на создание заявки