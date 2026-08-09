import { z } from "zod";

export const issueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Issue title must be at least 3 characters")
    .max(100, "Issue title cannot exceed 100 characters"),

  description: z
    .string()
    .max(
      1000,
      "Description cannot exceed 1000 characters"
    )
    .optional()
    .or(z.literal("")),

  type: z.enum([
    "Epic",
    "Story",
    "Task",
    "Bug",
    "Improvement",
    "Sub-task",
  ]),

  priority: z.enum([
    "Highest",
    "High",
    "Medium",
    "Low",
    "Lowest",
  ]),

  status: z.enum([
    "Backlog",
    "To Do",
    "In Progress",
    "Review",
    "Testing",
    "Done",
    "Blocked",
  ]),

  assignee: z.string().min(
    1,
    "Please select an assignee"
  ),

  reporter: z.string().min(
    1,
    "Please select a reporter"
  ),

  labels: z.string().optional(),

  dueDate: z
    .string()
    .optional()
    .or(z.literal("")),

  storyPoints: z
    .string()
    .optional()
    .or(z.literal("")),

  sprint: z.string().min(
    1,
    "Please select a sprint"
  ),

  epic: z.string().optional(),
});