import {
  authentication,
  signInWithEmailAndPassword,
} from "../../config/firebaseConfig";
import { Security } from "../../models/mongodb/user/userSecurity.model";
import DashboardService from "../../services/dashboard/dashboard.service";
import { UserCredential } from "firebase/auth";
import AuthService from "./authMain.service";

class LoginService {
  private static instance: LoginService;
  private dashboardService: DashboardService;
  private constructor() {
    this.dashboardService = DashboardService.getInstance();
  }

  public static getInstance(): LoginService {
    if (!LoginService.instance) {
      LoginService.instance = new LoginService();
    }
    return LoginService.instance;
  }

  // Authenticate the user using Firebase Authentication to email
  // Update number attempts login if login failed
  async signInWithEmailAndPassword(body: {
    email: string;
    password: string;
  }): Promise<{
    success?: boolean;
    status?: number;
    message?: string;
    data?: UserCredential;
  }> {
    const authService = AuthService.getInstance();
    const securityService = authService.getSecurityService();
    let firebaseAuthResponse;
    try {
      firebaseAuthResponse = await signInWithEmailAndPassword(
        authentication,
        body.email,
        body.password
      );
    } catch (error: any) {
      if (error.code === "auth/invalid-credential") {
        await securityService.trackFailedLoginAttempt(body.email);

        // Update Dashboard
        this.dashboardService.updateDashboardRecordsInCaching({
          totalFailedLogins: 1,
        });
        return {
          success: false,
          status: 400,
          message: `"Invalid email or password.`,
        };
      }
    }
    return { success: true, data: firebaseAuthResponse, status: 200 };
  }

  // Update user active when login
  async updateUserActive(userId: string, active: boolean): Promise<void> {
    try {
      await Security.updateOne(
        { userId },
        {
          $set: {
            active,
            numberLogin: 0,
            lastSeen: new Date().toISOString(),
          },
        }
      );
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to login user"
      );
    }
  }
}
export default LoginService;
