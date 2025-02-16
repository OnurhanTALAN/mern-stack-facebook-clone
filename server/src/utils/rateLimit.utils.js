import rateLimit from "express-rate-limit";

export const requestLimiter = rateLimit({
  windowMs: process.env.REQUEST_WINDOW_MS,
  max: process.env.REQUEST_ATTEMPTS,
  message: "Too many requests from this IP, please try again later.",
  headers: true,
});

export const loginLimiter = rateLimit({
  windowMs: process.env.LOGIN_WINDOW_MS,
  max: process.env.LOGIN_ATTEMPTS,
  message: "Too many login attempts, please try again later.",
  headers: true,
});

export const registerLimiter = rateLimit({
  windowMs: process.env.REGISTER_WINDOW_MS,
  max: process.env.REGISTER_ATTEMPTS,
  message: "Too many register attempts, please try again later.",
  headers: true,
});
