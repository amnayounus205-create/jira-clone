import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .email("Invalid email address"),

  password: z
    .min(6, "Password must be at least 6 characters"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Invalid email"),
});