import { z } from "zod";

// Define the schema for a conversation
export const ConversationDto = z.object({
  participants: z.array(z.string()),
  sellerName: z.string(),
  buyerName: z.string(),
  offerDetails: z
    .object({
      itemId: z.string(),
      status: z.string(),
      price: z.number(),
      originalPrice: z.number(),
    })
    .optional(),
  lastMessage: z
    .object({
      senderId: z.string().optional(),
      messageType: z
        .array(z.enum(["TEXT", "IMAGE", "VIDEO", "OFFER"]))
        .default(["TEXT"]),
      attachments: z.array(z.string()).default([]),
      text: z.string().optional(),
      timestamp: z.date().optional(),
    })
    .optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type ConversationDtoType = z.infer<typeof ConversationDto>;
