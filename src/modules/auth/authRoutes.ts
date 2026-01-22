import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
} from "./authController.js";
import { authMiddleware } from "../../shared/middleware/authMiddleware.js";
import { authRateLimiter } from "../../shared/middleware/rateLimiter.js";
import {
  validateRequest,
  sanitizeRequestBody,
} from "../../shared/middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
} from "../../shared/validation/schemas.js";

const router = Router();

router.post(
  "/register",
  authRateLimiter,
  sanitizeRequestBody,
  validateRequest(registerSchema),
  registerUser,
);
router.post(
  "/login",
  authRateLimiter,
  sanitizeRequestBody,
  validateRequest(loginSchema),
  loginUser,
);

router.post("/logout", logoutUser);

router.get("/profile", authMiddleware, getUserProfile);

export default router;
