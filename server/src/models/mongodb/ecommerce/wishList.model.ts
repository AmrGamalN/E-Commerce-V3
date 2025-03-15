import { model, Schema } from "mongoose";
import { WishListDtoType } from "../../../dto/ecommerce/wishList.dto";

const wishListSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    items: [
      {
        itemId: {
          type: String,
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false,
      },
    ],
  },
  { timestamps: true }
);

const WishList = model<WishListDtoType>("wishList", wishListSchema);
export default WishList;
