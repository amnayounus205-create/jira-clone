import { z } from "zod";

export const projectSchema = z.object({
  name: z
    .string()
    .min(3, "Project name must be at least 3 characters"),

  key: z
    .string()
    .min(2, "Project key is required")
    .max(5, "Maximum 5 characters")
    .transform((val) => val.toUpperCase()),

  lead: z
    .string()
    .min(3, "Project lead is required"),

  status: z.enum([
    "Planning",
    "Active",
    "Completed",
  ]),

  startDate: z.string().min(1, "Start Date is required"),

  endDate: z.string().min(1, "End Date is required"),
});