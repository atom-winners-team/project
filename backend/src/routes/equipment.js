import { Router } from "express";
import * as equipmentController from "../controllers/equipment.js";

const router = Router();

router.get("/", equipmentController.getAll);
router.get("/:id", equipmentController.getById);
router.get("/:id/history", equipmentController.getHistory);
router.post('/import', equipmentController.importBook);         
router.get("/history/unmatched", equipmentController.getUnmatchedHistory);

export default router;