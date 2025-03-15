import { z } from "zod";

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
  status: z.enum(["pending", "reviewed", "resolved"]).default("pending"),
  feedBack: z
    .object({
      replyId: z.string(),
      replyName: z.string(),
      message: z.string(),
      replyTime: z.date().default(new Date()),
    })
    .optional(),
});

export const ReportFeedBackDto = ReportDto.pick({
  modelId: true,
  status: true,
}).extend({
  message: z.string(),
});

export const ReportAddDto = ReportDto.pick({
  modelId: true, // Conversation or Item
  subject: true,
  reportType: true,
  reason: true,
});

export const ReportUpdateDto = ReportDto.pick({
  modelId: true, // Conversation or Item
  subject: true,
  reason: true,
});

export type ReportDtoType = z.infer<typeof ReportDto>;
export type ReportAddDtoType = z.infer<typeof ReportAddDto>;
export type ReportUpdateDtoType = z.infer<typeof ReportUpdateDto>;
export type ReportFeedBackDtoType = z.infer<typeof ReportFeedBackDto>;
