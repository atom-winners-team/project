import { Router } from "express";
import authRoutes from "./auth.js";
import equipmentRoutes from "./equipment.js";
import requestsRoutes from "./requests.js";
import { authenticate } from '../middlewares/authenticate.js'

const router = Router();

router.use("/auth", authRoutes);
router.use(authenticate);
router.use("/equipment", equipmentRoutes);
router.use("/requests", requestsRoutes);


export default router;