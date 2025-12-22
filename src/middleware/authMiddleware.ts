import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/tokenUtils.js";

interface User {
  id: string;
  role: string;
}

interface CustomRequest extends Request {
  user?: User;
}

const authMiddleware = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // Remove "Bearer " prefix if present
  const cleanToken = token.startsWith("Bearer ") ? token.slice(7) : token;

  // Verify the token and extract user information
  const user = verifyToken(cleanToken);

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = user as User; // Attach user to request object
  next();
};

const roleMiddleware = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    const user = req.user;

    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

export { authMiddleware, roleMiddleware };
