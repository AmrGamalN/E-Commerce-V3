import { z } from "zod";

// Define the dto for a report
export const ReportDto = z.object({
  id: z.string(),
  reporterId: z.string(),
  reportedUserId: z.string(),
  subject: z.string(),
  reportType: z.enum(["item", "conversation"]),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED"]).default("PENDING"),
});

export const ReportAddDto = z.object({
  id: z.string(), // Conversation or Item
  subject: z.string(),
  reportType: z.enum(["item", "conversation"]),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

export type ReportDtoType = z.infer<typeof ReportDto>;
export type ReportAddDtoType = z.infer<typeof ReportAddDto>;
