import { z } from "zod";

export const ItemDto = z.object({
  // ItemClassification
  category: z.string(),
  subcategory: z.string(),
  nestedSubCategory: z.string().optional(),
  brand: z.string(),
  categoryId: z.string().optional(),
  subCategoryId: z.string().optional(),
  type: z.string().optional(),

  // ItemDetails
  itemImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        rotateDeg: z.number(),
        _id: z.string().optional(),
      })
    )
    .default([]),
  title: z.string(),
  description: z.string(),
  condition: z.enum(["NEW", "OLD", "USE"]).default("NEW"),
  STATE: z
    .enum(["underReview", "approved", "published", "sold", "reject"])
    .default("underReview"),
  price: z.number().positive(),
  allowQuantity: z.number().default(1),
  availableQuantity: z.number().default(1),
  size: z.string().optional(),
  color: z.string().optional(),
  material: z.string().optional(),
  discount: z.number().min(0).max(100).optional(),
  isDiscount: z.boolean().optional().default(false).optional(),
  isSavedForLater: z.boolean().default(false),
  allowNegotiate: z.boolean().default(false),
  isFirstItem: z.boolean().default(true),
  couponId: z.string().optional(),

  // UserDetails
  userId: z.string(),
  communications: z.array(z.string()).default([]),
  paymentOptions: z.array(z.string()).default([]),
  location: z.string(),
  phone: z.string(),

  // ItemReview
  reviewId: z.array(z.string()).default([]),
  rate: z.object({
    avgRating: z.number(),
    rating: z.array(z.number()).default([0, 0, 0, 0, 0]),
    totalReviews: z.number(),
  }),

  // Offer
  coupons: z.string().optional(),
  isHighlighted: z.boolean().default(false),
  promotion: z.boolean().default(false),
});

export const ItemAddDto = ItemDto.pick({
  category: true,
  subcategory: true,
  nestedSubCategory: true,
  brand: true,
  type: true,
  itemImages: true,
  communications: true,
  title: true,
  description: true,
  condition: true,
  paymentOptions: true,
  location: true,
  phone: true,
  size: true,
  material: true,
  allowQuantity: true,
  availableQuantity: true,
  color: true,
  price: true,
  discount: true,
  isSavedForLater: true,
  allowNegotiate: true,
  coupons: true,
});

export type ItemAddDtoType = z.infer<typeof ItemAddDto>;
export type ItemDtoType = z.infer<typeof ItemDto>;
