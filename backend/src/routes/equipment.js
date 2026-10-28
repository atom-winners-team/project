import { Router } from "express";
import { ACTIONS } from "../auth/permissions.js";
import * as equipmentController from "../controllers/equipment.js";
import { requireAction } from "../middlewares/authorize.js";

const router = Router();
const viewEquipment = requireAction(ACTIONS.viewEquipment);

router.get("/", viewEquipment, equipmentController.getAll);
router.get("/:id", viewEquipment, equipmentController.getById);
router.get("/:id/history", viewEquipment, equipmentController.getHistory);
router.post("/import", equipmentController.importBook);
router.get("/history/unmatched", viewEquipment, equipmentController.getUnmatchedHistory);

export default router;