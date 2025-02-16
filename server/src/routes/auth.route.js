import express from "express";
import {
  login,
  logout,
  refresh,
  register,
  userCredentials,
} from "../controllers/auth.controller.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { loginLimiter, registerLimiter } from "../utils/rateLimit.utils.js";

const router = express.Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/logout", authenticateToken, logout);
router.post("/refresh", refresh);

router.get("/me", authenticateToken, userCredentials);

export default router;
