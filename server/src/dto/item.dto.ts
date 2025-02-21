import { z } from "zod";

export const ItemDto = z.object({
  _id: z.string().optional(),
  userId: z.string(),
  category: z.string(),
  subcategory: z.string(),
  brand: z.string(),
  itemImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        rotateDeg: z.number(),
        _id: z.string().optional(),
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
  price: z.number(),
  discount: z.number().default(0).optional(),
  isDiscount: z.boolean().optional().default(false).optional(),
  isSavedForLater: z.boolean().default(false),
  allowNegotiate: z.boolean().default(false),
  isFirstItem: z.boolean().default(true),
  isHighlighted: z.boolean().default(false),
  promotion: z.boolean().default(false),
});

export const ItemAddDto = z.object({
  category: z.string(),
  subcategory: z.string(),
  brand: z.string(),
  type: z.string().optional(),
  itemImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        rotateDeg: z.number(),
        _id: z.string().optional(),
      })
    )
    .default([]),
  communications: z.array(z.string()).default([]),
  title: z.string(),
  description: z.string(),
  condition: z.enum(["NEW", "OLD", "USE"]).default("NEW"),
  paymentOptions: z.array(z.string()).default([]),
  location: z.string(),
  phone: z.string(),
  size: z.string().optional(),
  color: z.string().optional(),
  price: z.number().optional(),
  discount: z.number().default(0).optional(),
  isDiscount: z.boolean().optional().default(false).optional(),
  isSavedForLater: z.boolean().default(false),
  allowNegotiate: z.boolean().default(false),
});

export type ItemAddDtoType = z.infer<typeof ItemAddDto>;
export type ItemDtoType = z.infer<typeof ItemDto>;
