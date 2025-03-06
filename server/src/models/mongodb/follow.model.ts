import mongoose, { Schema } from "mongoose";

const FollowSchema = new Schema(
  {
    followerId: { type: String, ref: "User", required: true },
    followingId: { type: String, ref: "User", required: true },
    followingName: { type: String, required: true },
  },
  { timestamps: true }
);

FollowSchema.index({ followerId: 1, followingId: 1 }, { unique: true });

const Follow = mongoose.model("Follow", FollowSchema);
export default Follow;
