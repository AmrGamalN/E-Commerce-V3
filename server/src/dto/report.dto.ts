import { z } from "zod";

export const ReportFeedBackDto = z.object({
  modelId: z.string(),
  message: z.string(),
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED"]).default("REVIEWED"),
});

// Define the dto for a report
export const ReportDto = z.object({
  modelId: z.string(),
  reporterId: z.string(),
  reporterName: z.string(),
  reporterEmail: z.string(),
  reportedUserId: z.string(),
  subject: z.string(),
  reportType: z.enum(["item", "conversation"]),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
  status: z.enum(["PENDING", "REVIEWED", "RESOLVED"]).default("PENDING"),
  feedBack: z
    .object({
      replyId: z.string(),
      replyName: z.string(),
      message: z.string(),
      replyTime: z.date().default(new Date()),
    })
    .optional(),
});

export const ReportAddDto = z.object({
  modelId: z.string(), // Conversation or Item
  subject: z.string(),
  reportType: z.enum(["item", "conversation"]),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

export const ReportUpdateDto = z.object({
  modelId: z.string(), // Conversation or Item
  subject: z.string(),
  reason: z
    .string()
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason must not exceed 500 characters"),
});

export type ReportDtoType = z.infer<typeof ReportDto>;
export type ReportAddDtoType = z.infer<typeof ReportAddDto>;
export type ReportUpdateDtoType = z.infer<typeof ReportUpdateDto>;
export type ReportFeedBackDtoType = z.infer<typeof ReportFeedBackDto>;
