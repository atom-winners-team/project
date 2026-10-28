
import * as authService from "../services/auth.service.js";

export const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      return res.status(400).json({
        message: "Введите логин и пароль",
      });
    }

    const result = await authService.login({
      login,
      password,
    });

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};
