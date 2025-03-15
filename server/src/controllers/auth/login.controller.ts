import { auth } from "../../config/firebaseConfig";
import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/generateToken.utils";
import { UserSecurityDtoType } from "../../dto/user/userSecurity.dto";
import dashboardService from "../../services/dashboard/dashboard.service";
import { UserCredential } from "firebase/auth";
import AuthService from "../../services/auth/authMain.service";
const authService = AuthService.getInstance();
const securityService = authService.getSecurityService();
const loginService = authService.getLoginService();

class LoginController {
  private static instance: LoginController;
  private dashboardService: dashboardService;

  constructor() {
    this.dashboardService = new dashboardService();
  }

  static getInstance(): LoginController {
    if (!LoginController.instance) {
      LoginController.instance = new LoginController();
    }
    return LoginController.instance;
  }

  // Login by email
  async loginByEmail(req: Request, res: Response): Promise<void> {
    // Validate user existence
    const existingUser = (await securityService.findUser(
      req.body,
      "email"
    )) as {
      success: boolean;
      status: number;
      message: string;
      data: UserSecurityDtoType;
      remainingTime: number;
    };

    if (!existingUser.success) {
      res.status(existingUser.status).json({ message: existingUser.message });
      return;
    }

    //  Authenticate user via Firebase
    const firebaseAuthResponse = (await loginService.signInWithEmailAndPassword(
      req.body
    )) as {
      status: number;
      message: string;
      success: boolean;
      data?: UserCredential;
    };

    if (!firebaseAuthResponse.success) {
      res
        .status(firebaseAuthResponse.status)
        .json({ message: firebaseAuthResponse.message });
      return;
    }

    // Retrieve Firebase refresh token
    const userRefreshToken = firebaseAuthResponse.data?.user.refreshToken;

    // Handle Two-Factor Authentication (2FA)
    if (existingUser.data.isTwoFactorAuth) {
      res.status(200).json({
        message: "2FA required",
        userId: existingUser.data.userId,
        refreshToken: userRefreshToken,
      });
      return;
    }

    // Generate authentication token and update dashboard and update user active
    generateToken(res, firebaseAuthResponse.data, "email", userRefreshToken);
    if (!existingUser.data.active) {
      this.dashboardService.updateDashboardRecordsInCaching({
        totalLoginInDay: 1,
        activeUsers: 1,
        inactiveUsers: -1,
        totalSuccessLogins: 1,
      });
    }
    loginService.updateUserActive(existingUser.data.userId, true);
    res.status(200).json({ message: "Login successful" });
  }

  // Login user by phone
  async loginByPhone(req: Request, res: Response): Promise<void> {
    const { mobile, password } = req.body;

    // Find user existence
    const existingUser = (await securityService.findUser(
      req.body,
      "phone"
    )) as {
      success: boolean;
      status: number;
      message: string;
      data: UserSecurityDtoType;
      remainingTime: number;
    };

    if (!existingUser.success) {
      res.status(existingUser.status).json({ message: existingUser.message });
      return;
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.data.password
    );

    if (!isPasswordValid) {
      await securityService.trackFailedLoginAttempt(mobile);
      this.dashboardService.updateDashboardRecordsInCaching({
        totalFailedLogins: 1,
      });
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate authentication token and update dashboard and update user active
    generateToken(res, existingUser, "phone");
    if (!existingUser.data.active) {
      this.dashboardService.updateDashboardRecordsInCaching({
        totalLoginInDay: 1,
        activeUsers: 1,
        inactiveUsers: -1,
        totalSuccessLogins: 1,
      });
    }
    loginService.updateUserActive(existingUser.data.userId, true);
    res.status(200).json({ message: "Login successful" });
  }

  // Logout
  async logOut(req: Request, res: Response): Promise<void> {
    const userId = req.user?.user_id;
    res.clearCookie("RefreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    // Revoke refreshToken from firebase
    if (userId) {
      await auth.revokeRefreshTokens(userId);
    }

    // Update dashboard
    this.dashboardService.updateDashboardRecordsInCaching({
      activeUsers: -1,
      inactiveUsers: 1,
    });
    loginService.updateUserActive(userId, false);
    res.status(200).json({
      message: "Logged out successfully, clear access token from frontend.",
    });
  }
}
export default LoginController;
