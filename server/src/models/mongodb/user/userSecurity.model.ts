import { Schema, model } from "mongoose";
import { UserSecurityDtoType } from "../../../dto/user/userSecurity.dto";
const ROLES = ["USER", "ADMIN", "MANAGER", "CALL_CENTER"];
// const ROLES = [ "ADMIN", "MANAGER", "CSA",];

// opt schema
const otpSchema: Schema = new Schema({
  mobile: { type: String, required: true },
  otp: { type: String, required: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
});

// User info and security
export const userSecuritySchema: Schema = new Schema({
  userId: { type: String, ref: "users", required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, lowercase: true, unique: true },
  mobile: { type: String, unique: true, sparse: true },
  role: { type: String, required: true, enum: ROLES, default: "USER" },
  password: { type: String, required: true },
  fcmTokens: { type: [String], default: [] },
  twoFactorSecret: { type: String, default: "" },
  isTwoFactorAuth: { type: Boolean, default: false },
  numberLogin: { type: Number, default: 0 },
  lastFailedLoginTime: { type: Date, default: null },
  confirmAccount: { type: Boolean, default: false },
  active: { type: Boolean, default: false },
  lastSeen: { type: Date, default: "" },
  dateOfJoining: { type: Date, default: "" },
  signWith: { type: String, enum: ["phone", "email"] },
});

export const Otp = model("otps", otpSchema);
export const Security = model<UserSecurityDtoType>(
  "securities",
  userSecuritySchema
);
