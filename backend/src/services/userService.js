import bcrypt from 'bcrypt';

import * as userRepository from '../repositories/userRepository.js';

import { AppError } from '../errors/AppError.js';
import { NotFoundError } from '../errors/NotFound.js';
import { getAuthConfig } from '../config/auth.js';

const toPublicUser = (user) => {
    return {
        id: user.id,
        login: user.login,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

export const getById = async (id) => {
    const user = await userRepository.findById(id);

    if (!user) {
        throw new NotFoundError('Пользователь не найден');
    }

    return toPublicUser(user);
};

export const getAll = async () => {
    const users = await userRepository.findAll();

    return users.map(toPublicUser);
};

export const create = async ({ login, password, role }) => {
    const existingUser = await userRepository.findByUsername(login);

    if (existingUser) {
        throw new AppError(
            'Пользователь с таким логином уже существует',
            409,
            'LOGIN_ALREADY_EXISTS',
        );
    }

    const { bcryptRounds } = getAuthConfig();
    const passwordHash = await bcrypt.hash(password, bcryptRounds);

    try {
        const user = await userRepository.create({
            login,
            password_hash: passwordHash,
            role,
        });

        return toPublicUser(user);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(
                'Пользователь с таким логином уже существует',
                409,
                'LOGIN_ALREADY_EXISTS',
            );
        }

        throw error;
    }
};

export const update = async (id, { login, role }) => {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
        throw new NotFoundError('Пользователь не найден');
    }

    const changes = {};

    if (login !== undefined) {
        changes.login = login;
    }

    if (role !== undefined) {
        changes.role = role;
    }

    if (Object.keys(changes).length === 0) {
        throw new AppError(
            'Передайте логин или роль для изменения',
            400,
            'EMPTY_UPDATE',
        );
    }

    try {
        const updatedUser = await userRepository.update(id, changes);

        if (!updatedUser) {
            throw new NotFoundError('Пользователь не найден');
        }

        return toPublicUser(updatedUser);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            throw new AppError(
                'Пользователь с таким логином уже существует',
                409,
                'LOGIN_ALREADY_EXISTS',
            );
        }

        throw error;
    }
};

export const remove = async (id) => {
    const existingUser = await userRepository.findById(id);

    if (!existingUser) {
        throw new NotFoundError('Пользователь не найден');
    }

    try {
        const deletedCount = await userRepository.remove(id);

        if (deletedCount === 0) {
            throw new NotFoundError('Пользователь не найден');
        }

    } catch (error) {
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            throw new AppError(
                'Нельзя удалить пользователя, на него ссылаются другие записи',
                409,
                'USER_HAS_RELATED_RECORDS',
            );
        }

        throw error;
    }
};