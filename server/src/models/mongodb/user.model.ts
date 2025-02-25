import mongoose, { Schema } from "mongoose";
import { UserDtoType } from "../../dto/user.dto";
const ROLES = ["USER", "ADMIN", "MANAGER", "CALL_CENTER"];

// Defining the schema for the user
const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    mobile: {
      type: String,
      default: null,
    },
    gender: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      required: true,
      enum: ROLES,
    },
    business: {
      type: Boolean,
      required: true,
      default: false,
    },
    personal: {
      type: Boolean,
      required: true,
      default: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    coverImage: {
      type: String,
      default: "",
    },
    numOfPostsInADay: {
      type: Number,
      default: 0,
    },
    dateOfJoining: {
      type: Date,
      default: "",
    },
    followers: {
      type: Number,
      default: 0,
    },
    following: {
      type: Number,
      default: 0,
    },
    lastSeen: {
      type: Date,
      default: "",
    },
    paymentOptions: {
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
    description: {
      type: String,
      default: "",
    },
    addressIds: {
      type: [String],
      default: [],
    },
    userId: {
      type: String,
      required: true,
    },
    allowedToShow: {
      type: [String],
      default: [],
    },
    profileImage: {
      type: String,
      default: "",
    },
    itemsListing: [
      {
        id: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    ],
    purchaseHistory: [
      {
        id: {
          type: String,
          default: "",
        },
        name: {
          type: String,
          default: "",
        },
      },
    ],
    fcmTokens: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model<UserDtoType>("users", userSchema);
export default User;
