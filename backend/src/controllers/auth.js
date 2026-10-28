import * as authService from "../services/auth.js";

export const register = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (typeof login !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }

    const user = await authService.register({ login, password });
    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (typeof login !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }

    res.status(200).json(await authService.login({ login, password }));
  } catch (error) {
    next(error);
  }
};
