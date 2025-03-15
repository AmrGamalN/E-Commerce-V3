import qrcode from "qrcode";
import speakeasy from "speakeasy";
import { Security } from "../../models/mongodb/user/userSecurity.model";
import DashboardService from "../../services/dashboard/dashboard.service";

interface ServiceResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data?: T;
}

class TwoFactorAuthService {
  private static instance: TwoFactorAuthService;
  private dashboardService: DashboardService;

  private constructor() {
    this.dashboardService = DashboardService.getInstance();
  }

  public static getInstance(): TwoFactorAuthService {
    if (!TwoFactorAuthService.instance) {
      TwoFactorAuthService.instance = new TwoFactorAuthService();
    }
    return TwoFactorAuthService.instance;
  }

  // Generate two factor authentication and QRcode
  async generate2FA(
    userId: string
  ): Promise<ServiceResponse<{ qrCode: Buffer }>> {
    try {
      const secret = speakeasy.generateSecret({
        name: `E-Commerce-User-${userId}`,
        length: 20,
      });

      if (!secret.otpauth_url) {
        return {
          success: false,
          status: 500,
          message: "Failed to generate OTP Auth URL",
        };
      }

      await Security.updateOne(
        { userId: userId },
        { $set: { twoFactorSecret: secret.base32, isTwoFactorAuth: true } }
      );

      const qrCodeBuffer = await qrcode.toBuffer(secret.otpauth_url);
      return {
        success: true,
        status: 200,
        message: "2FA generated successfully",
        data: { qrCode: qrCodeBuffer },
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }

  // Verify two factor authentication
  async verify2FA(
    userId: string,
    token: string
  ): Promise<ServiceResponse<null>> {
    try {
      const find2FA = await Security.findOne({ userId: userId }).select(
        "twoFactorSecret isTwoFactorAuth"
      );

      if (!find2FA || !find2FA.twoFactorSecret) {
        return { success: false, status: 400, message: "2FA secret not found" };
      }

      const verified = speakeasy.totp.verify({
        secret: find2FA.twoFactorSecret,
        encoding: "base32",
        token,
        window: 1,
      });

      if (!verified) {
        // Update dashboard
        this.dashboardService.updateDashboardRecordsInCaching({
          total2FAFailed: 1,
          totalFailedLogins: 1,
        });
        return { success: false, status: 400, message: "Invalid code" };
      }

      // Update dashboard
      this.dashboardService.updateDashboardRecordsInCaching({
        total2FASuccess: 1,
        totalSuccessLogins: 1,
      });

      return {
        success: true,
        status: 200,
        message: "2FA verified successfully",
      };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Internal Server Error"
      );
    }
  }
}

export default TwoFactorAuthService;
