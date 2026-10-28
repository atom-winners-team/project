import { Router } from "express";
import * as equipmentController from "../controllers/equipment.js";
import { USER_ROLES } from "../models/constants.js";
import { requireRoles } from "../middlewares/requireRoles.js";

const router = Router();

router.use(
  requireRoles(USER_ROLES.duty, USER_ROLES.director, USER_ROLES.engineer),
);

router.get("/", equipmentController.getAll);
router.get("/:id", equipmentController.getById);
router.get("/:id/history", equipmentController.getHistory);
router.post(
  "/import",
  requireRoles(USER_ROLES.duty),
  equipmentController.importBook,
);
router.get("/history/unmatched", equipmentController.getUnmatchedHistory);

export default router;