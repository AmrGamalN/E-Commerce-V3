import mongoose, { model, Schema } from "mongoose";
import { ItemDtoType } from "../../dto/item.dto";

const CONDITION = ["NEW", "OLD", "USED"];
const STATE = ["UNDER_REVIEW", "APPROVED", "PUBLISHED", "SOLD", "REJECT"];

const ItemSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    brand: { type: String, required: true, trim: true },
    itemImages: [
      {
        imageUrl: String,
        rotateDeg: Number,
        _id: {
          type: String,
          default: () => new mongoose.Types.ObjectId().toString(),
        },
      },
    ],
    communications: [],
    title: { type: String, required: true },
    description: { type: String, required: true },
    condition: {
      type: String,
      required: true,
      enum: CONDITION,
      default: "NEW",
    },
    status: {
      type: String,
      required: true,
      enum: STATE,
      default: "UNDER_REVIEW",
    },
    paymentOptions: {
      type: [String],
      default: [],
    },
    location: { type: String, required: true },
    phone: { type: String, optional: true },
    type: { type: String, optional: true },
    size: { type: String, optional: true },
    color: { type: String, optional: true },
    price: { type: Number, required: true },
    discount: { type: Number, required: true, default: 0, optional: true },
    isDiscount: { type: Boolean, default: false, optional: true },
    isSavedForLater: { type: Boolean, optional: true, default: false },
    allowNegotiate: { type: Boolean, default: false },
    isFirstItem: { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false },
    promotion: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Item = model<ItemDtoType>("items", ItemSchema);
export default Item;
