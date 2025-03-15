import { Request, Response } from "express";
import { generateToken } from "../../utils/generateToken.utils";
import AuthService from "../../services/auth/authMain.service";
const authService = AuthService.getInstance();
const twoFactorAuthService = authService.getTwoFactorAuthService();

class TwoFactorAuthController {
  private static instance: TwoFactorAuthController;

  private constructor() {
  }

  public static getInstance(): TwoFactorAuthController {
    if (!TwoFactorAuthController.instance) {
      TwoFactorAuthController.instance = new TwoFactorAuthController();
    }
    return TwoFactorAuthController.instance;
  }

  // Generate two factor authentication and QRcode
  async generateTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<void> {
    const userId = req.user?.user_id;
    const { qrCode } = (await twoFactorAuthService.generate2FA(userId))
      .data as { qrCode: Buffer };
    res.setHeader("Content-Type", "image/png");
    res.setHeader("Content-Disposition", "inline; filename=qr-code.png");
    res.send(qrCode);
  }

  // Verify two factor authentication
  async verifyTwoFactorAuthentication(
    req: Request,
    res: Response
  ): Promise<void> {
    const { userId, token, refreshToken } = req.body;
    const isValid = await twoFactorAuthService.verify2FA(userId, token);
    if (!isValid.success) {
      res
        .status(isValid.status)
        .json({ success: isValid.success, message: "Invalid code" });
      return;
    }
    generateToken(res, userId, "email", refreshToken);
    res.status(200).json({ message: "2FA verified successfully" });
  }
}

export default TwoFactorAuthController;
