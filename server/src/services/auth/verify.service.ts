import { Otp, Security } from "../../models/mongodb/user/userSecurity.model";
import { generateOtp } from "../../utils/generateSecretCode.utils";
import RegisterService from "./register.service";

class VerifyService {
  private static instance: VerifyService;
  private registerService: RegisterService;
  private constructor() {
    this.registerService = RegisterService.getInstance();
  }

  public static getInstance(): VerifyService {
    if (!VerifyService.instance) {
      VerifyService.instance = new VerifyService();
    }
    return VerifyService.instance;
  }

  // Verify email
  async verifyByEmail(userId: string): Promise<void> {
    try {
      await this.registerService.saveUserInDatabase(userId);
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Email verification failed"
      );
    }
  }

  // Verify phone
  async verifyByPhone(mobile: string, otp: string): Promise<object> {
    try {
      const findOtp = await Otp.findOneAndDelete({ mobile: mobile, otp: otp });
      const user = await Security.findOne({ mobile: mobile });

      if (user?.confirmAccount == true) {
        return { message: "Phone is already verified", success: false };
      }

      if (!findOtp) {
        return {
          message: "Invalid OTP, please send otp again",
          success: false,
        };
      }
      await this.registerService.saveUserInDatabase(String(findOtp.userId));
      return { message: "Phone verified successfully", success: true };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Phone verification failed"
      );
    }
  }

  // Send otp
  async sendOtpAgain(mobile: string, userId: string): Promise<object> {
    try {
      const findOtp = await Otp.findOne({
        mobile: mobile,
        userId: userId,
      }).lean();

      const userSecurity = await Security.findOne({
        mobile: mobile,
      })
        .select("confirmAccount")
        .lean();

      if (userSecurity?.confirmAccount == true) {
        return { message: "Phone is already verified", success: false };
      }

      if (findOtp) {
        return { message: "OTP has already been sent.", success: false };
      }
      const otp = generateOtp();
      await Otp.create({
        mobile: mobile,
        otp,
        userId: userId,
        expiresAt: new Date().getTime() + 1000 * 60,
      });
      // await sendOtpToPhone(mobile, otp);
      return { message: "Send otp successfully", success: true };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Error send otp"
      );
    }
  }
}

export default VerifyService;
