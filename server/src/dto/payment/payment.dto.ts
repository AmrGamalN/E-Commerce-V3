import { z } from "zod";
import { UserDto } from "../user/user.dto";

export const PaymentDto = z.object({
  transactionId: z.string().min(1, "Transaction ID is required"),
  orderId: z.string().min(1, "Order ID is required"),
  buyerId: z.string().min(1, "Buyer ID is required"),
  sellerId: z.string().min(1, "Seller ID is required"),
  amount: z.number().positive("Amount must be a positive number"),
  transactionFee: z
    .number()
    .nonnegative("Transaction fee must be 0 or positive"),
  paymentMethod: z.string().min(1, "Payment method is required"),
  paymentGateway: z.string().min(1, "Payment gateway is required"),
  gatewayResponse: z.object({}).optional(),
  status: z
    .enum([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "refund",
      "cancelled",
    ])
    .default("pending"),
});

export const PaymentUpdateDto = PaymentDto.partial();

export const GetPaymentDto = z.object({
  transactionId: z.string().optional(),
  orderId: z.string().optional(),
});

export const UserPaymentDto = UserDto.pick({
  paymentOptions: true,
});

export type PaymentDtoType = z.infer<typeof PaymentDto>;
export type PaymentUpdateDtoType = z.infer<typeof PaymentUpdateDto>;
export type GetPaymentType = z.infer<typeof GetPaymentDto>;
