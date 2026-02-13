import { farmerService } from "./farmerService.js";
import type { Request, Response } from "express";
import { asyncHandler } from "../../shared/middleware/errorHandler.js";

export const createFarmerProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const validatedBody = (req as any).validatedData?.body;
    const profile = await farmerService.createProfile(userId, validatedBody);
    res
      .status(201)
      .json({ message: "Farmer profile created successfully", profile });
  },
);

export const adminverifyFarmer = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedBody = (req as any).validatedData?.body;
    const { userId, status } = validatedBody;
    const farmerProfile = await farmerService.verifyFarmer(userId, status);
    res
      .status(200)
      .json({ message: "Farmer verification status updated", farmerProfile });
  },
);
