import { Schema, model } from "mongoose";
import { UserDtoType } from "../../../dto/user/user.dto";

// Personal Information
const personalInfoSchema = {
  userId: { type: String, ref: "securities", required: true, unique: true },
  gender: { type: String },
  coverImage: { type: String, default: "" },
  description: { type: String, default: "" },
  business: { type: Boolean, required: true, default: false },
  personal: { type: Boolean, required: true, default: true },
  addressIds: { type: [String], default: [] },
  profileImage: { type: String, default: "" },
  paymentOptions: { type: [String], default: [] },
};

// Social Information
const socialSchema = {
  numOfPostsInADay: { type: Number, default: 0 },
  followers: { type: Number, default: 0, min: 0 },
  following: { type: Number, default: 0, min: 0 },
  allowedToShow: { type: [String], default: [] },
  itemsListing: [
    {
      id: { type: String, default: "" },
      name: { type: String, default: "" },
    },
  ],
  purchaseHistory: [
    {
      id: { type: String, default: "" },
      name: { type: String, default: "" },
    },
  ],
};

// User Rating
const ratingSchema = {
  avgRating: { type: Number, default: 0 },
  rating: { type: [Number], default: [0, 0, 0, 0, 0] }, // ["bad", "average", "good", "very good", "excellent"]
  totalReviews: { type: Number, default: 0 },
};

// Main user schema
const userSchema: Schema = new Schema(
  {
    ...personalInfoSchema,
    ...socialSchema,
    rate: ratingSchema,
  },
  {
    timestamps: true,
  }
);


export const User = model<UserDtoType>("users", userSchema);
