import { z } from "zod";

export const organizationSchema = z.object({
  name: z
    .string()
    .min(3, "Organization name is required"),

  key: z
    .string()
    .min(2, "Organization key is required")
    .max(6, "Maximum 6 characters")
    .transform((value) => value.toUpperCase()),

  owner: z
    .string()
    .min(3, "Owner name is required"),

  email: z
    .string()
    .email("Invalid email"),

  phone: z
    .string()
    .min(10, "Invalid phone number"),

  website: z
    .string()
    .url("Invalid website URL"),

  description: z
    .string()
    .min(10, "Description is required"),

  status: z.enum([
    "Planning",
    "Active",
    "Completed",
  ]),
});