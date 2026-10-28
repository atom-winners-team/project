
import * as equipmentService from "../services/equipment.js";

// GET /api/equipment
export const getAll = async (req, res, next) => {
  try {
    const equipment = await equipmentService.getAll(req.query);

    res.status(200).json(equipment);
  } catch (error) {
    next(error);
  }
};

// GET /api/equipment/:id
export const getById = async (req, res, next) => {
  try {
    const equipment = await equipmentService.getById(
      req.params.id
    );

    if (!equipment) {
      return res.status(404).json({
        message: "Оборудование не найдено",
      });
    }

    res.status(200).json(equipment);
  } catch (error) {
    next(error);
  }
};

// GET /api/equipment/:id/history
export const getHistory = async (req, res, next) => {
  try {
    const history = await equipmentService.getHistory(
      req.params.id
    );

    res.status(200).json(history);
  } catch (error) {
    next(error);
  }
};
