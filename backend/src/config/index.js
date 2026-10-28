import "dotenv/config";
import { z } from "zod";

const authConfigSchema = z.object({
  accessTokenSecret: z.string().min(32),
  accessTokenTtlSeconds: z.coerce.number().int().min(60).max(3600).default(900),
  bcryptRounds: z.coerce.number().int().min(10).max(15).default(12),
});

export const readRequiredString = (name) => {
  const value = process.env[name];

  if (value === undefined || value.trim().length === 0) {
    throw new Error(`${name} is required`);
  }

  return value;
};

export const getAuthConfig = () =>
  authConfigSchema.parse({
    accessTokenSecret: readRequiredString("ACCESS_TOKEN_SECRET"),
    accessTokenTtlSeconds: process.env.ACCESS_TOKEN_TTL_SECONDS,
    bcryptRounds: process.env.BCRYPT_ROUNDS,
  });

const parsePort = (value, name = "PORT") => {
  if (value === undefined) {
    return 4000;
  }

  const port = Number(value);

  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error(`${name} must be an integer between 1 and 65535`);
  }

  return port;
};

const parsePositiveNumber = (value, fallback, name) => {
  if (value === undefined) {
    return fallback;
  }

  const number = Number(value);

  if (!Number.isFinite(number) || number <= 0) {
    throw new Error(`${name} must be a positive number`);
  }

  return number;
};

const parseCorsOrigins = (value) => {
  const origins = value ?? process.env.CORS_ORIGIN ?? "http://localhost:3000";

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter((origin) => origin.length > 0);
};

const getDatabaseConnection = () => ({
  username: readRequiredString("PG_USER"),
  password: readRequiredString("PG_PASSWORD"),
  database: readRequiredString("PG_DATABASE"),
  host: process.env.PG_HOST ?? "localhost",
  port: parsePort(process.env.PG_PORT ?? "5432", "PG_PORT"),
  dialect: "postgres",
});

const getDatabaseConfig = () => {
  const database = getDatabaseConnection();
  return {
    development: { ...database },
    test: { ...database },
    production: { ...database },
  };
};

export const config = {
  get port() {
    return parsePort(process.env.PORT);
  },

  get nodeEnv() {
    return process.env.NODE_ENV ?? "development";
  },

  get isProduction() {
    return this.nodeEnv === "production";
  },

  get database() {
    return getDatabaseConnection();
  },

  get logLevel() {
    return process.env.LOG_LEVEL ?? "info";
  },

  get logPretty() {
    return process.env.LOG_PRETTY === "true";
  },

  get requestTimeoutMs() {
    return parsePositiveNumber(
      process.env.REQUEST_TIMEOUT_MS,
      5000,
      "REQUEST_TIMEOUT_MS",
    );
  },

  get corsOrigins() {
    return parseCorsOrigins(process.env.CORS_ORIGINS);
  },

  get rateLimitWindowMs() {
    return parsePositiveNumber(
      process.env.RATE_LIMIT_WINDOW_MS,
      60000,
      "RATE_LIMIT_WINDOW_MS",
    );
  },

  get rateLimitMax() {
    return parsePositiveNumber(
      process.env.RATE_LIMIT_MAX,
      100,
      "RATE_LIMIT_MAX",
    );
  },
};

export default getDatabaseConfig;
