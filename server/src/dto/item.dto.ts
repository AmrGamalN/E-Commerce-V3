import { z } from "zod";

export const ItemDto = z.object({
  userId: z.string(),
  category: z.string(),
  subcategory: z.string(),
  brand: z.string(),
  itemImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        rotateDeg: z.number(),
      })
    )
    .default([]),
  communications: z.array(z.string()).default([]),
  title: z.string(),
  description: z.string(),
  condition: z.enum(["NEW", "OLD", "USE"]).default("NEW"),
  STATE: z
    .enum(["UNDER_REVIEW", "PUBLISHED", "SOLD", "REJECT"])
    .default("UNDER_REVIEW"),
  paymentOptions: z.array(z.string()).default([]),
  location: z.string(),
  phone: z.string(),
  type: z.string(),
  size: z.string(),
  color: z.string(),
  price: z.string(),
  discount: z.number().default(0).optional(),
  isDiscount: z.boolean().optional().default(false).optional(),
  isSavedForLater: z.boolean().default(false),
  allowNegotiate: z.boolean().default(false),
  isFirstItem: z.boolean().default(true),
  isHighlighted: z.boolean().default(false),
  promotion: z.boolean().default(false),
});

export type ItemDtoType = z.infer<typeof ItemDto>;
