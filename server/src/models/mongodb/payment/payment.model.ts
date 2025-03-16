import { Schema, model } from "mongoose";
import { PaymentDtoType } from "../../../dto/payment/payment.dto";

const paymentSchema: Schema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    amount: { type: Number, required: true },
    transactionFee: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentGateway: { type: String, required: true },
    gatewayResponse: { type: Object, default: {} },
    status: {
      type: String,
      enum: [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "refund",
        "cancelled",
      ],
      required: true,
      default: "pending",
    },
  },
  { timestamps: true }
);

const Address = model<PaymentDtoType>("payment", paymentSchema);
export default Address;
