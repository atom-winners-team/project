import { Router } from "express";
import authRoutes from "./auth.js";
import equipmentRoutes from "./equipment.js";
import requestsRoutes from "./requests.js";
import userRoutes from "./user.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/equipment", equipmentRoutes);
router.use("/requests", requestsRoutes);
router.use("/users", userRoutes);

export default router;
