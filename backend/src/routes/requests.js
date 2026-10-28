import { Router } from "express";
import * as requestsController from "../controllers/requests.controller";

const router = Router();

//регистрируем маршруты
router.get("/", requestsController.getAll); 
router.get("/:id", requestsController.getById);
router.post("/", requestsController.create);
router.patch("/:id", requestsController.update);
router.post("/:id/assign", requestsController.assign);
router.post("/:id/status", requestsController.changeStatus);

export default router;

// тут ловим запросы на создание заявки