import { randomBytes } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UniqueConstraintError } from "sequelize";
import { getAuthConfig } from "../config/index.js";
import { AppError } from "../errors/AppError.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { USER_ROLES } from "../models/constants.js";
import {
  create,
  findById,
  findByLogin,
} from "../repositories/userRepository.js";

const publicUser = (user) => ({
  id: user.id,
  login: user.login,
  role: user.role,
});

const validateCredentials = (login, password) => {
  const normalizedLogin = login.trim();
  if (
    normalizedLogin.length < 3 ||
    normalizedLogin.length > 64 ||
    password.length < 8 ||
    Buffer.byteLength(password, "utf8") > 72
  ) {
    throw new AppError("Некорректный логин или пароль", 400, "INVALID_INPUT");
  }
  return normalizedLogin;
};

export const register = async ({ login, password }) => {
  const normalizedLogin = validateCredentials(login, password);
  const { bcryptRounds } = getAuthConfig();
  const passwordHash = await bcrypt.hash(password, bcryptRounds);

  try {
    const user = await create({
      login: normalizedLogin,
      password_hash: passwordHash,
      role: USER_ROLES.engineer,
    });
    return publicUser(user);
  } catch (error) {
    if (error instanceof UniqueConstraintError) {
      throw new AppError(
        "Пользователь с таким логином уже существует",
        409,
        "LOGIN_TAKEN",
      );
    }
    throw error;
  }
};

let dummyPasswordHash;
const getDummyPasswordHash = async (rounds) => {
  dummyPasswordHash ??= bcrypt.hash(randomBytes(32).toString("hex"), rounds);
  return dummyPasswordHash;
};

export const login = async ({ login, password }) => {
  const normalizedLogin = login.trim();
  const { accessTokenSecret, accessTokenTtlSeconds, bcryptRounds } =
    getAuthConfig();
  const user = await findByLogin(normalizedLogin);
  const storedPasswordHash =
    user?.password_hash ?? (await getDummyPasswordHash(bcryptRounds));
  const passwordMatches = await bcrypt.compare(password, storedPasswordHash);

  if (!user || !passwordMatches) {
    throw new UnauthorizedError("Неверный логин или пароль");
  }

  const accessToken = jwt.sign({ role: user.role }, accessTokenSecret, {
    algorithm: "HS256",
    subject: String(user.id),
    expiresIn: accessTokenTtlSeconds,
  });

  return {
    accessToken,
    tokenType: "Bearer",
    expiresIn: accessTokenTtlSeconds,
    user: publicUser(user),
  };
};

export const findAuthenticatedUser = (id) => findById(id);
