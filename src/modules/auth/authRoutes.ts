import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from "./authController.js";
import { authMiddleware } from "../../shared/middleware/authMiddleware.js";
import { authRateLimiter, profileUpdateRateLimiter } from "../../shared/middleware/rateLimiter.js";
import {
  validateRequest,
  sanitizeRequestBody,
} from "../../shared/middleware/validationMiddleware.js";
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
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

router.patch(
  "/profile",
  authMiddleware,
  profileUpdateRateLimiter,
  sanitizeRequestBody,
  validateRequest(updateProfileSchema),
  updateUserProfile,
);

export default router;
