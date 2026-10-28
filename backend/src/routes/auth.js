import { Router } from "express";
import * as authController from "../controllers/auth.js";
import { validate } from '../middlewares/validate.js';
import { loginBodySchema } from '../schemas/auth.js'

const router = Router();

router.post("/register", validate(loginBodySchema), authController.register);
router.post("/login", validate(loginBodySchema), authController.login);

export default router;