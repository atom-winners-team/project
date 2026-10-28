import * as equipmentService from "../services/equipment.js";
import * as equipmentRep from "../services/equipmentRep.js"

// Получаем все оборудование
export const getAll = async (req, res, next) => {
  try {
    res.status(200).json(await equipmentRep.getAll());
  } catch (error) {
    next(error);
  }
};

// получаем оборудование по id
export const getById = async (req, res, next) => {
  try {
    res.status(200).json(await equipmentService.getById(req.params.id));
  } catch (error) {
    next(error);
  }
};

// получаем историю оборудования по id
export const getHistory = async (req, res, next) => {
  try {
    res.status(200).json(await equipmentService.getHistory(req.params.id));
  } catch (error) {
    next(error);
  }
};

// импортируем оборудование из файла
export const importBook = async (req, res, next) => {
  try {
    const filePath = req.body?.filePath || req.query?.filePath;

    if (!filePath) {
      return res.status(400).json({
        message: "Не указан путь к файлу",
      });
    }

    const result = await equipmentService.importFromFixedBook(filePath);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

// получаем историю оборудования без соответствия
export const getUnmatchedHistory = async (req, res, next) => {
  try {
    res.status(200).json(await equipmentService.getUnmatchedHistory());
  } catch (error) {
    next(error);
  }
};
