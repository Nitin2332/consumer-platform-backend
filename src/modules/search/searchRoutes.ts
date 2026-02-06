import { Router } from "express";
import { searchNearbyFarmers } from "./searchController.js";
import {
  authMiddleware,
  roleMiddleware,
} from "../../shared/middleware/authMiddleware.js";

const router = Router();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["CONSUMER"]),
  async (req, res) => {
    const { address, radius } = req.body;
    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }
    try {
      // Use a default radius of 10km if not provided
      const searchRadius = radius || 10;
      const farmers = await searchNearbyFarmers(address, searchRadius);
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  },
);

export default router;
