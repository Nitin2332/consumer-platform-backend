import { z } from "zod";

// Auth Schemas
export const registerSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one digit")
      .regex(
        /[!@#$%^&*]/,
        "Password must contain at least one special character (!@#$%^&*)",
      ),
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters")
      .max(100, "Full name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
      ),
    role: z.enum(["FARMER", "CONSUMER"]).optional().default("CONSUMER"),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
  }),
});

// Product Schemas
export const addProductSchema = z.object({
  body: z.object({
    categoryId: z.string().cuid("Invalid category ID format"),
    name: z
      .string()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name must not exceed 150 characters")
      .regex(
        /^[a-zA-Z0-9\s\-.,()]+$/,
        "Product name contains invalid characters",
      ),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),
    price: z
      .number()
      .int("Price must be an integer")
      .positive("Price must be greater than 0"),
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .nonnegative("Quantity cannot be negative"),
    unit: z
      .string()
      .min(1, "Unit is required")
      .max(50, "Unit must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Unit can only contain letters"),
  }),
});

// Product update schema
export const updateProductSchema = z.object({
  params: z.object({
    productId: z.cuid("Invalid product ID format"),
  }),
  body: z.object({
    categoryId: z.cuid("Invalid category ID format").optional(),
    name: z
      .string()
      .min(3, "Product name must be at least 3 characters")
      .max(150, "Product name must not exceed 150 characters")
      .regex(
        /^[a-zA-Z0-9\s\-.,()]+$/,
        "Product name contains invalid characters",
      )
      .optional(),
    description: z
      .string()
      .max(1000, "Description must not exceed 1000 characters")
      .optional()
      .or(z.literal("")),
    price: z
      .number()
      .int("Price must be an integer")
      .positive("Price must be greater than 0")
      .optional(),
    quantity: z
      .number()
      .int("Quantity must be an integer")
      .nonnegative("Quantity cannot be negative")
      .optional(),
    unit: z
      .string()
      .min(1, "Unit is required")
      .max(50, "Unit must not exceed 50 characters")
      .regex(/^[a-zA-Z\s]+$/, "Unit can only contain letters")
      .optional(),
  }),
});

export const deleteProductSchema = z.object({
  params: z.object({
    productId: z.cuid("Invalid product ID format"),
  }),
});

export const addCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "Category name can only contain letters, spaces, and hyphens",
      ),
  }),
});

// Farmer Profile Schema
export const createFarmerProfileSchema = z.object({
  body: z.object({
    farmName: z
      .string()
      .min(2, "Farm name must be at least 2 characters")
      .max(150, "Farm name must not exceed 150 characters")
      .regex(/^[a-zA-Z0-9\s\-.,&]+$/, "Farm name contains invalid characters"),
    bio: z
      .string()
      .max(500, "Bio must not exceed 500 characters")
      .optional()
      .or(z.literal("")),
    phoneNumber: z
      .string()
      .regex(
        /^[\d\s\-\+\(\)]{10,20}$/,
        "Phone number must be valid and between 10-20 characters",
      ),
    contactPreference: z.enum(["CALL", "WHATSAPP", "BOTH"]).default("BOTH"),
    address: z
      .string()
      .min(5, "Address must be at least 5 characters")
      .max(200, "Address must not exceed 200 characters"),
    city: z
      .string()
      .min(2, "City must be at least 2 characters")
      .max(100, "City must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "City name can only contain letters, spaces, and hyphens",
      ),
    district: z
      .string()
      .min(2, "District must be at least 2 characters")
      .max(100, "District must not exceed 100 characters")
      .regex(
        /^[a-zA-Z\s-]+$/,
        "District name can only contain letters, spaces, and hyphens",
      ),
  }),
});

export const verifyFarmerSchema = z.object({
  body: z.object({
    userId: z.cuid("Invalid user ID format"),
    status: z
      .boolean()
      .or(z.enum(["true", "false"]))
      .transform((val) => (typeof val === "string" ? val === "true" : val)),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type AddProductInput = z.infer<typeof addProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type DeleteProductInput = z.infer<typeof deleteProductSchema>;
export type AddCategoryInput = z.infer<typeof addCategorySchema>;
export type CreateFarmerProfileInput = z.infer<
  typeof createFarmerProfileSchema
>;
export type VerifyFarmerInput = z.infer<typeof verifyFarmerSchema>;
