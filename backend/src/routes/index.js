import { Router } from "express";
import authRoutes from "./auth";
import equipmentRoutes from "./equipment";
import requestsRoutes from "./requests";

const router = Router();

router.use("/auth", authRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/requests", requestsRoutes);

export default router;
