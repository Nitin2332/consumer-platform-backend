import type { Request, Response } from "express";
import { authService } from "./authService.js";
import { userRepository } from "../user/userRepository.js";
import { generateToken } from "../../shared/utils/jwtUtil.js";
import {
  throwError,
  asyncHandler,
} from "../../shared/middleware/errorHandler.js";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 3600000, // 1 hour
};

// User registration
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedBody = (req as any).validatedData?.body;
    const user = await authService.register(validatedBody);
    const token = generateToken(user.id, user.role);

    res.cookie("token", token, cookieOptions);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    });
  },
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const validatedBody = (req as any).validatedData?.body;
  const user = await authService.login(validatedBody);
  const token = generateToken(user.id, user.role);

  res.cookie("token", token, cookieOptions);
  res.status(200).json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
  });
});

// User logout
export const logoutUser = (req: Request, res: Response) => {
  res.clearCookie("token", cookieOptions);
  res.status(200).json({ message: "Logout successful" });
};

// Get user profile
export const getUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = (req as any).user?.id;
    if (!userId) throw throwError(401, "Unauthorized");

    const user = await userRepository.findProfileById(userId);

    if (!user) throw throwError(404, "User not found");

    res.status(200).json({ message: "Profile retrieved", user });
  },
);
