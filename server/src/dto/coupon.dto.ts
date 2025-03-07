import { z } from "zod";
export const CouponDto = z.object({
  sellerId: z.string(),
  code: z
    .string()
    .min(9)
    .max(9)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid code format"),
  discount: z.number().int().min(1).max(100),
  maxUses: z.number().int().min(1),
  remainingUses: z.number().int().min(0),
  numberUses: z.number().int().min(0).default(0),
  itemId: z.string(),
  expiresAt: z.date().default(() => new Date()),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CouponAddDto = z.object({
  discount: z.number().int().min(1).max(100),
  maxUses: z.number().int().min(1),
  itemId: z.string(),
  expiresAt: z.date().default(() => new Date()),
});

export const CouponUpdateDto = z.object({
  discount: z.number().int().min(1).max(100),
  maxUses: z.number().int().min(1),
  couponId: z.string(),
  expiresAt: z.date().default(() => new Date()),
});

export const CouponApplyDto = z.object({
  couponId: z.string(),
  orderId: z.string(),
  code: z
    .string()
    .min(9)
    .max(9)
    .regex(/^[a-zA-Z0-9]+$/, "Invalid code format"),
  quantity: z.number().min(1).max(10).positive(),
  price: z.number(),
});

export type CouponDtoType = z.infer<typeof CouponDto>;
export type CouponAddDtoType = z.infer<typeof CouponAddDto>;
export type CouponUpdateDtoType = z.infer<typeof CouponUpdateDto>;
export type CouponApplyDtoType = z.infer<typeof CouponApplyDto>;
