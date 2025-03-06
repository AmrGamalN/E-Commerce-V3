import jwt from "jsonwebtoken";
import { Response } from "express";

// Used to generate token when user login with phone or email and two factor authentication
export const generateToken = (
  res: Response,
  user: any,
  typeLogin: string,
  refreshToken?: string
) => {
  const payload = {
    user_id: user.userId,
    email: user.email,
    mobile: user.mobile,
    role: user.role,
    signWith: typeLogin,
  };

  // check type login if phone create refresh token , if email take refresh token from firebase
  if (typeLogin === "phone") {
    refreshToken = jwt.sign(payload, process.env.SLAT as string, {
      expiresIn: "14d",
      algorithm: "HS256",
    });
  }

  // Add refresh token in cookies
  res.cookie("RefreshToken", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
};
