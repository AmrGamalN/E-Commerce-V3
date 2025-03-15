import { z } from "zod";

export const NotificationDto = z.object({
  notification: z.string(),
  type: z.string(),
  buyerId: z.string(),
  sellerId: z.string(),
  itemId: z.string(),
  time: z.date(),
  status: z.enum(["read", "unread"]).default("unread"),
});

export type NotificationDtoType = z.infer<typeof NotificationDto>;
