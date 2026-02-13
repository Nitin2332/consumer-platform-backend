import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

interface CustomError extends Error {
  statusCode?: number;
}

const isCustomError = (err: unknown): err is CustomError => {
  return !!err && typeof err === "object" && "statusCode" in (err as any);
};

export const throwError = (
  statusCode: number,
  message: string,
): CustomError => {
  const error: CustomError = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const errorHandler = (
  error: Error | CustomError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal server error";
  const errors: Array<{ field: string; message: string }> = [];

  if (error instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    error.issues.forEach((issue) => {
      errors.push({
        field: issue.path.join(".") || "unknown",
        message: issue.message,
      });
    });
  } else if (isCustomError(error) && error.statusCode) {
    statusCode = error.statusCode || 500;
    message = error.message || "Internal server error";
  } else if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  } else if (error.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  } else if (error.message?.includes("Not allowed by CORS")) {
    statusCode = 403;
    message = "CORS error: Origin not allowed";
  } else if (error instanceof Error) {
    message = error.message || "Internal server error";
  }

  if (process.env.NODE_ENV === "development") {
    console.error("Error:", { statusCode, message, stack: error.stack });
  }

  const response: any = {
    success: false,
    statusCode,
    message,
  };

  if (errors.length > 0) {
    response.errors = errors;
  }

  res.status(statusCode).json(response);
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = throwError(404, `Route ${req.originalUrl} not found`);
  next(error);
};
