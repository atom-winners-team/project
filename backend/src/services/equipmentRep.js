import * as equipmentRepository from '../repositories/equipment.js';
import { importFromFixedBook } from './import.js';
import { NotFoundError } from '../errors/NotFoundError.js';

// Получаем все оборудование
export const getAll = async () => {
    const equipment = await equipmentRepository.findAll();
    if (!equipment || equipment.length === 0) {

        // throw new NotFoundError('Оборудование не найдено');
        return [];
    }
    return equipment;
};

// Получаем оборудование по id
export const getById = async (id) => {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
        throw new NotFoundError(`Оборудование с id=${id} не найдено`);
    }
    return equipment;
};

// Получаем историю оборудования по id
export const getHistory = async (id) => {
    // Сначала проверяем, что оборудование существует
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
        throw new NotFoundError(`Оборудование с id=${id} не найдено`);
    }
    return equipmentRepository.getHistoryByEquipmentId(id);
};

// Импортируем оборудование из файла
export const importBook = async (filePath) => {
    return importFromFixedBook(filePath);
};

// Получаем историю оборудования без соответствия
export const getUnmatchedHistory = async () => {
    return equipmentRepository.findUnmatchedHistory();
};