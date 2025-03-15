import { model, Schema } from "mongoose";
import { ReviewDtoType } from "../../../dto/ecommerce/review.dto";
const title = ["bad", "average", "good", "veryGood", "excellent"]

const reviewSchema: Schema = new Schema({
  rate: { type: Number, required: true },
  description: { type: String, required: true },
  title: { type: String, enum: title, required: true, default: "good" },
  buyerId: { type: String, required: true },
  sellerId: { type: String, required: true },
  buyerName:{ type: String, required: true },
  itemId: { type: String, required: true },
}, {timestamps:true});

const Address = model<ReviewDtoType>("reviews", reviewSchema);
export default Address;
