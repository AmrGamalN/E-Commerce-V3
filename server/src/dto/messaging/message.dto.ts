import { z } from "zod";

export const MessageDto = z.object({
  conversationId: z.string().optional(),
  senderId: z.string(),
  receiverId: z.string(),
  messageType: z
    .array(z.enum(["TEXT", "IMAGE", "VIDEO", "OFFER"]))
    .default(["TEXT"]),
  text: z.string().default(""),
  attachments: z.array(z.string()).default([]),
  readStatus: z.record(z.string(), z.boolean()).default({}),
  offerDetails: z.object({
    itemId: z.string(),
    price: z.number(),
    status: z.string(),
    originalPrice: z.number(),
  }),
});

export const MessageAddDto = MessageDto.pick({
  senderId: true,
  receiverId: true,
  messageType: true,
  text: true,
  attachments: true,
  readStatus: true,
}).extend({
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type MessageDtoType = z.infer<typeof MessageDto>;
export type MessageAddDtoType = z.infer<typeof MessageAddDto>;
