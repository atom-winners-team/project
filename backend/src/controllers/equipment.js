import * as equipmentRepository from "../repositories/equipmentRepository.js";
import { importFromFixedBook } from "../services/equipment.js";

// Получаем все оборудование
export const getAll = async (req, res, next) => {
  try {
    const equipment = await equipmentRepository.findAll();

    res.status(200).json(equipment);
  } catch (error) {
    next(error);
  }
};

// получаем оборудование по id
export const getById = async (req, res, next) => {
  try {
    const equipment = await equipmentRepository.findById(req.params.id);

    if (!equipment) {
      return next(new NotFoundError("Оборудование не найдено"));
    }

    res.status(200).json(equipment);
  } catch (error) {
    next(error);
  }
};

// получаем историю оборудования по id
export const getHistory = async (req, res, next) => {
  try {
    const history = await equipmentRepository.getHistoryByEquipmentId(req.params.id);

    res.status(200).json(history);
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

    const result = await importFromFixedBook(filePath);

    res.status(200).json({ result });
  } catch (error) {
    next(error);
  }
};

// получаем историю оборудования без соответствия
export const getUnmatchedHistory = async (req, res, next) => {
  try {
    const items = await equipmentRepository.findUnmatchedHistory();

    res.status(200).json(items);
  } catch (error) {
    next(error);
  }
};
