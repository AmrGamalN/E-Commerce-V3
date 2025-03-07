import { Request, Response} from "express";
import qrcode from "qrcode";
import speakeasy from "speakeasy";
import User from "../models/mongodb/user.model";
import crypto from "node:crypto";
import { generateToken } from "./generateToken.utils";

export class TwoFactorAuthController {
  public static async generateTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = req.user?.user_id;
      const secret = speakeasy.generateSecret({
        name: `E-Commerce-User-${userId}`,
        length: 20,
      });

      if (!secret.otpauth_url) {
        res.status(500).json({ error: "Failed to generate OTP Auth URL" });
        return;
      }

      await User.findOneAndUpdate(
        { userId: userId },
        {
          $set: { twoFactorSecret: secret.base32, isTwoFactorAuth: true },
        }
      );

      const qrCodeBuffer = await qrcode.toBuffer(secret.otpauth_url);

      res.setHeader("Content-Type", "image/png");
      res.setHeader("Content-Disposition", "inline; filename=qr-code.png");
      res.send(qrCodeBuffer);
      return;
    } catch (error) {
      res.status(500).json({ message: "Failed to generate secret code." });
    }
  }

  public static async VerifyTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { userId, token, refreshToken } = req.body;
      const user = await User.findOne({ userId: userId }).select(
        "twoFactorSecret isTwoFactorAuth"
      );

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      if (!user.twoFactorSecret) {
        res.status(400).json({ error: "2FA secret not found" });
        return;
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret as string,
        encoding: "base32",
        token,
        window: 1,
      });

      if (!verified) {
        res.status(400).json({ error: "Invalid code" });
        return;
      }

      generateToken(res, user, "email", refreshToken); // here you should email when work with frontend i send refresh token to frontend  when login with email
      res.status(200).json({ message: "2FA verified successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to verify secret code." });
    }
  }
}
