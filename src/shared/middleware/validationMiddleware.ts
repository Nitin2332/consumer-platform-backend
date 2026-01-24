import type { Request, Response, NextFunction } from "express";
import type { ZodType } from "zod";
import { ZodError } from "zod";

// Extend Express Request to include validated data
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}

export const validateRequest =
  (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      const validationData = {
        body: req.body,
        params: req.params,
        query: req.query,
      };

      const validated = schema.parse(validationData);
      req.validatedData = validated;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        return res.status(400).json({
          message: "Validation error",
          errors: formattedErrors,
        });
      }

      res.status(500).json({ message: "Internal server error" });
    }
  };

// Sanitization helper function to remove potentially harmful characters
export const sanitizeInput = (input: any): any => {
  if (typeof input === "string") {
    // Remove null bytes and other dangerous characters
    return input.replace(/\0/g, "").trim();
  }

  if (Array.isArray(input)) {
    return input.map(sanitizeInput);
  }

  if (input !== null && typeof input === "object") {
    const sanitized: any = {};
    for (const key in input) {
      if (Object.prototype.hasOwnProperty.call(input, key)) {
        sanitized[key] = sanitizeInput(input[key]);
      }
    }
    return sanitized;
  }

  return input;
};

// Middleware to sanitize request body
export const sanitizeRequestBody = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.body = sanitizeInput(req.body);
  next();
};
