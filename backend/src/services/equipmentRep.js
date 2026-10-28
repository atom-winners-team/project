import * as equipmentService from '../repositories/equipmentRepository.js';
import * as equipmentRepository from '../repositories/equipmentRepository.js';
import { NotFoundError } from '../errors/NotFound.js';

export const getAll = async () => {
    const equipment = await equipmentRepository.findAll();
    if (!equipment || equipment.length === 0) {

        // throw new NotFoundError('Оборудование не найдено');
        return [];
    }
    return equipment;
};

export const getById = async (id) => {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
        throw new NotFoundError(`Оборудование с id=${id} не найдено`);
    }
    return equipment;
};

export const getHistory = async (id) => {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
        throw new NotFoundError(`Оборудование с id=${id} не найдено`);
    }
    return equipmentRepository.getHistoryByEquipmentId(id);
};

export const importBook = async (filePath) => {
    return equipmentService.importFromFixedBook(filePath);
};

export const getUnmatchedHistory = async () => {
    return equipmentRepository.findUnmatchedHistory();
};
