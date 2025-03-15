import mongoose, { model, Schema } from "mongoose";
import { ItemDtoType } from "../../../dto/ecommerce/item.dto";

const CONDITION = ["NEW", "OLD", "USED"];
const STATE = ["underReview", "approved", "published", "sold", "reject"];
const COMMUNICATION = ["PHONE", "CHAT"];

const ItemSchema: Schema = new Schema(
  {
    // ItemClassification
    category: { type: String, required: true, trim: true },
    subcategory: { type: String, required: true, trim: true },
    nestedSubCategory: { type: String, required: false, trim: true }, // Used with clothes - accessories category ....
    brand: { type: String, required: true, trim: true },
    type: { type: String, optional: true },
    categoryId: { type: String, optional: true },
    subCategoryId: { type: String, optional: true },

    // ItemDetails
    title: { type: String, required: true },
    description: { type: String, required: true },
    condition: {
      type: String,
      required: true,
      enum: CONDITION,
      default: "NEW",
    },
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
    size: { type: String, optional: true },
    color: { type: String, optional: true },
    material: { type: String, optional: true },
    price: { type: Number, required: true },
    discount: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      optional: true,
    }, // Discount to all user
    isDiscount: { type: Boolean, default: false, optional: true },
    isSavedForLater: { type: Boolean, optional: true, default: false },
    allowNegotiate: { type: Boolean, default: false },
    isFirstItem: { type: Boolean, default: false },
    isHighlighted: { type: Boolean, default: false }, // Used to advertisement
    promotion: { type: Boolean, default: false },
    availableQuantity: { type: Number, required: true, default: 1 }, // Number of quantity is available
    allowQuantity: { type: Number, required: true, default: 1 }, // Used to allow quantity for the user who is purchasing.
    couponId: { type: String, optional: true }, //  Discount to some target users

    // UserDetails
    userId: {
      type: String,
      required: true,
    },
    communications: [],
    status: {
      type: String,
      required: true,
      enum: STATE,
      default: "underReview",
    },
    paymentOptions: {
      type: [String],
      default: [],
    },
    location: { type: String, required: true },
    phone: { type: String, optional: true },

    // ItemReview
    reviewId: {
      type: [String],
      default: [],
    },
    rate: {
      avgRating: {
        type: Number,
        default: 0,
      },
      rating: {
        type: [Number],
        default: [0, 0, 0, 0, 0], // ["bad", "average", "good", "very good", "excellent"]
      },
      totalReviews: {
        type: Number,
        default: 0,
      },
    },
  },
  { timestamps: true }
);

const Item = model<ItemDtoType>("items", ItemSchema);
export default Item;
