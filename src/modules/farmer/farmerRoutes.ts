import { Router } from "express";
import {
  authMiddleware,
  roleMiddleware,
} from "../../shared/middleware/authMiddleware.js";
import { adminverifyFarmer, createFarmerProfile } from "./farmerController.js";
import {
  validateRequest,
  sanitizeRequestBody,
} from "../../shared/middleware/validationMiddleware.js";
import {
  createFarmerProfileSchema,
  verifyFarmerSchema,
} from "../../shared/validation/schemas.js";

const router = Router();

router.post(
  "/profile",
  authMiddleware,
  roleMiddleware(["FARMER"]),
  sanitizeRequestBody,
  validateRequest(createFarmerProfileSchema),
  createFarmerProfile,
);

router.patch(
  "/verify",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  sanitizeRequestBody,
  validateRequest(verifyFarmerSchema),
  adminverifyFarmer,
);

export default router;
