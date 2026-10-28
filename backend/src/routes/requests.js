import { Router } from "express";
import { ACTIONS } from "../auth/permissions.js";
import * as requestsController from "../controllers/requests.js";
import { requireAction } from "../middlewares/authorize.js";

const router = Router();

router.get("/", requireAction(ACTIONS.viewRequests), requestsController.getAll);
router.get(
  "/summary",
  requireAction(ACTIONS.viewSummary, "Сводка доступна только директору"),
  requestsController.getSummary,
);
router.get("/:id", requireAction(ACTIONS.viewRequests), requestsController.getById);
router.post(
  "/",
  requireAction(ACTIONS.createRequest, "Создавать заявки может только дежурный"),
  requestsController.create,
);
router.patch(
  "/:id",
  requireAction(ACTIONS.updateSchedule, "Менять срок и приоритет может только директор"),
  requestsController.update,
);
router.post(
  "/:id/assign",
  requireAction(ACTIONS.assignRequest, "Назначать исполнителя может только директор"),
  requestsController.assign,
);
router.post("/:id/status", requestsController.changeStatus);

export default router;