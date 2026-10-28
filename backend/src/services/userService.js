import bcrypt from 'bcrypt';

import * as userRepository from '../repositories/userRepository.js';

import { AppError } from '../errors/AppError.js';
import { NotFoundError } from '../errors/NotFound.js';

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

    const passwordHash = await bcrypt.hash(password, process.env.SALT_ROUNDS);

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