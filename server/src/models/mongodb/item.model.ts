import mongoose, { model, Schema } from "mongoose";

const CONDITION = ["NEW", "OLD", "USE"];
const STAUTE = ["UNDER_REVIEW", "PUBLISHED", "SOLD", "REJECT"];

const ItemSchema: Schema = new Schema(
  {
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true },
    brand: { type: String, required: true },
    itemImages: [
      {
        imageUrl: String,
        rotateDeg: Number,
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
    price: { type: Number, required: true },
    allowNegotiate: { type: Boolean, default: false },
    phone: { type: String, optional: true },
    isSavedForLater: { type: Boolean, optional: true, default: false },
    location: { type: String, required: true },
    userId: {
      type: String,
      required: true,
      default: "6782672e6150f9b649f86906",
    },
    isFirstItem: { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false },
    status: {
      type: String,
      required: true,
      enum: STAUTE,
      default: "under review",
    },
    promotion: { type: Boolean, default: false },
    discount: { type: Number, required: true, default: 0, optional: true },
    type: { type: String, optional: true },
    size: { type: String, optional: true },
    color: { type: String, optional: true },
    isDiscount: { type: Boolean, default: false, optional: true },
    paymentOptions: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// const item = Model<ItemDtoType>("items", ItemSchema);
const item = model("items", ItemSchema);
export default item;
