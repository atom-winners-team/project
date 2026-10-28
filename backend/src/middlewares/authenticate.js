import jwt from "jsonwebtoken";
import { getAuthConfig } from "../config/auth.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import { findAuthenticatedUser } from "../services/auth.js";

export const authenticate = async (req, _res, next) => {
  const authorization = req.get("authorization");
  const match = authorization?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    next(new UnauthorizedError());
    return;
  }

  try {
    const { accessTokenSecret } = getAuthConfig();
    const claims = jwt.verify(match[1], accessTokenSecret, {
      algorithms: ["HS256"],
    });

    if (
      typeof claims === "string" ||
      typeof claims.sub !== "string" ||
      !/^\d+$/.test(claims.sub)
    ) {
      next(new UnauthorizedError("Недействительный access-токен"));
      return;
    }

    const user = await findAuthenticatedUser(Number(claims.sub));
    if (!user) {
      next(new UnauthorizedError("Недействительный access-токен"));
      return;
    }

    req.user = {
      id: user.id,
      login: user.login,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new UnauthorizedError("Недействительный access-токен"));
      return;
    }
    next(error);
  }
};
