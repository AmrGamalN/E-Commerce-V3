import { Request, Response } from "express";
import AuthService from "../../services/auth/authMain.service";
const authService = AuthService.getInstance();
const securityService = authService.getSecurityService();
const verifyService = authService.getVerifyService();

class VerifyController {
  private static instance: VerifyController;

  constructor() {}

  static getInstance(): VerifyController {
    if (!VerifyController.instance) {
      VerifyController.instance = new VerifyController();
    }
    return VerifyController.instance;
  }

  // Verify email
  async verifyByEmail(req: Request, res: Response): Promise<void> {
    const { userId } = req.body;
    const existingUser = await securityService.findUserInFirebase(
      req.body,
      "email"
    );

    if (!existingUser.success) {
      res.status(existingUser.status).json({ message: existingUser.message });
      return;
    }

    if (existingUser?.emailVerified == true) {
      res.status(200).json({ message: "Email is already verified" });
      return;
    }

    await verifyService.verifyByEmail(userId);
    res.status(200).json({ message: "Email verified successfully." });
    return;
  }

  // Verify phone
  async verifyByPhone(req: Request, res: Response): Promise<void> {
    const { otp, mobile } = req.body;
    const result = (await verifyService.verifyByPhone(mobile, otp)) as {
      message: string;
      success: boolean;
    };
    if (!result.success) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  }

  // Send otp
  async sendOtpAgain(req: Request, res: Response): Promise<void> {
    const { mobile, userId } = req.body;
    const result = (await verifyService.sendOtpAgain(mobile, userId)) as {
      message: string;
      success: boolean;
    };
    if (result.success == false) {
      res.status(400).json(result);
      return;
    }
    res.status(200).json(result);
  }
}
export default VerifyController;
