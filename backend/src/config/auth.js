import { z } from "zod";

import { readRequiredString } from "./env.js";

const authConfigSchema = z.object({
  accessTokenSecret: z.string().min(32),
  accessTokenTtlSeconds: z.coerce.number().int().min(60).max(3600).default(900),
  bcryptRounds: z.coerce.number().int().min(10).max(15).default(12),
});

export const getAuthConfig = () =>
  authConfigSchema.parse({
    accessTokenSecret: readRequiredString("ACCESS_TOKEN_SECRET"),
    accessTokenTtlSeconds: process.env.ACCESS_TOKEN_TTL_SECONDS,
    bcryptRounds: process.env.BCRYPT_ROUNDS,
  });
