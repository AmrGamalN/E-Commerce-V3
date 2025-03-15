import { auth } from "../../config/firebaseConfig";
import { Security } from "../../models/mongodb/user/userSecurity.model";
import { UserSecurityDtoType } from "../../dto/user/userSecurity.dto";

class SecurityService {
  private static instance: SecurityService;
  constructor() {}

  static getInstance(): SecurityService {
    if (!SecurityService.instance) {
      SecurityService.instance = new SecurityService();
    }
    return SecurityService.instance;
  }

  //#region Find user in firebase and database
  // Main function used to find user in database and firebase
  async findUser(
    bodyData: any,
    typeLogin: string
  ): Promise<{
    success: boolean;
    status?: number;
    message?: string;
    data?: UserSecurityDtoType;
    remainingTime?: number;
  }> {
    try {
      // Find user in the database & Firebase
      const existingUserInDB = await this.findUserInDatabase(
        bodyData,
        typeLogin
      );
      const existingUserFirebase = await this.findUserInFirebase(
        bodyData,
        typeLogin
      );

      if (!existingUserInDB.success && !existingUserFirebase) {
        return {
          success: existingUserInDB.success,
          status: existingUserInDB.status,
          message: existingUserInDB.message,
        };
      }

      // Check if the user is locked due to multiple failed login attempts
      const loginCheck = await this.checkAttemptsLogin(existingUserInDB.data!);
      if (!loginCheck.success) {
        return {
          success: loginCheck.success,
          status: loginCheck.status,
          message: loginCheck.message,
          remainingTime: loginCheck.remainingTime,
        };
      }

      // Check email/phone verification before proceeding
      if (
        (!existingUserFirebase?.emailVerified && typeLogin == "email") ||
        (!existingUserInDB?.data?.confirmAccount && typeLogin == "phone")
      ) {
        return {
          success: existingUserInDB.success,
          status: existingUserInDB.status,
          message: `${typeLogin} is not verified yet.`,
        };
      }
      return {
        success: true,
        data: existingUserInDB.data,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "An error occurred while fetching user data."
      );
    }
  }

  // Find user in firebase
  async findUserInFirebase(
    bodyData: { mobile: string; email: string },
    typeLogin: string
  ): Promise<any> {
    try {
      if (typeLogin === "phone" && bodyData.mobile) {
        return await auth.getUserByPhoneNumber(bodyData.mobile);
      }
      if (typeLogin === "email" && bodyData.email) {
        return await auth.getUserByEmail(bodyData.email);
      }
      return null;
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        return null;
      }
      throw new Error("Error checking user existence: " + error.message);
    }
  }

  // Find user in database
  private async findUserInDatabase(
    bodyData: { mobile: string; email: string },
    typeLogin: string
  ): Promise<{
    success: boolean;
    status?: number;
    message?: string;
    data?: UserSecurityDtoType;
  }> {
    try {
      const query =
        typeLogin === "phone"
          ? { mobile: bodyData.mobile, signWith: "phone" }
          : { email: bodyData.email, signWith: "email" };

      const existingUser = await Security.findOne(query)
        .select([
          "email",
          "isTwoFactorAuth",
          "userId",
          "mobile",
          "numberLogin",
          "lastFailedLoginTime",
          "confirmAccount",
          "password",
          "active",
        ])
        .lean();

      if (!existingUser) {
        return {
          success: false,
          status: 404,
          message: "User not found.",
        };
      }

      return {
        success: true,
        data: existingUser,
      };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Failed to find user in database"
      );
    }
  }

  //#endregion

  //#region check number attempts Login
  // Used to check the number of failed login attempts
  // Used to avoid brute force attack
  private async checkAttemptsLogin(existingUser: UserSecurityDtoType): Promise<{
    success: boolean;
    status?: number;
    message?: string;
    remainingTime?: number;
  }> {
    try {
      if (existingUser.numberLogin >= 3) {
        const currentTime = Date.now();
        const lastFailedTime = new Date(
          existingUser.lastFailedLoginTime as Date
        ).getTime();
        const timeDifference = (currentTime - lastFailedTime) / (1000 * 60);

        if (timeDifference < 10) {
          const remainingTime = Math.ceil(10 - timeDifference);
          return {
            success: false,
            status: 400,
            message: `Your account is temporarily locked due to multiple failed login attempts. Please try again in ${remainingTime} minutes or reset your password.`,
            remainingTime: remainingTime,
          };
        }

        await Security.updateOne(
          { email: existingUser.email },
          { $set: { numberLogin: 0, lastFailedLoginTime: null } }
        );
      }

      return { success: true };
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error while checking login attempts."
      );
    }
  }

  // Update number of failed login
  async trackFailedLoginAttempt(identifier: string): Promise<void> {
    try {
      const user = await Security.findOne({
        $or: [{ mobile: identifier }, { email: identifier }],
      });
      if (!user) return;
      await Security.updateOne(
        { _id: user._id },
        {
          $inc: { numberLogin: 1 },
          $set: { lastFailedLoginTime: new Date().toISOString() },
        }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error
          ? error.message
          : "Error tracking failed login attempt:"
      );
    }
  }

  //#endregion
}
export default SecurityService;
