import { z } from "zod";

export const workspaceSchema = z.object({
  name: z
    .string()
    .min(3, "Workspace name must be at least 3 characters"),

  key: z
    .string()
    .min(2, "Workspace key is required")
    .max(5, "Maximum 5 characters")
    .transform((val) => val.toUpperCase()),

  description: z
    .string()
    .min(10, "Description must be at least 10 characters"),

  owner: z
    .string()
    .min(3, "Workspace owner is required"),

  status: z.enum(["Active", "Archived"]),
});