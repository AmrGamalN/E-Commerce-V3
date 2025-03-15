import { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebaseConfig";
import { Security } from "../models/mongodb/user/userSecurity.model";
import axios from "axios";
import jwt from "jsonwebtoken";
import DashboardService from "../services/dashboard/dashboard.service";

// Used to add user in request to handle in typescript
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    accessToken?: any;
  }
}
class AuthenticationMiddleware {
  private static Instance: AuthenticationMiddleware;
  private DashboardService: DashboardService;
  constructor() {
    this.DashboardService = new DashboardService();
  }

  public static getInstance() {
    if (!AuthenticationMiddleware.Instance) {
      AuthenticationMiddleware.Instance = new AuthenticationMiddleware();
    }
    return AuthenticationMiddleware.Instance;
  }

  async verifyIdToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.accessToken.token;
      if (!accessToken) {
        // Update Dashboard
        this.DashboardService.updateDashboardRecordsInCaching({
          totalUnauthorized: 1,
        });

        res.status(401).json({ message: "unauthorized: No token provided." });
        return;
      }

      let decoded: any;
      if (req.accessToken.signWith == "phone") {
        // Using when user login with phone [using jwt]
        decoded = jwt.verify(accessToken, process.env.SLAT as string, {
          algorithms: ["HS256"],
        });
      } else {
        // Using when user login with email [using default firebase token]
        decoded = await auth.verifyIdToken(accessToken);
      }

      if (!decoded) {
        res.status(401).json({ message: "Invalid Auth Token." });
        return;
      }

      const user = await Security.findOne({ userId: decoded?.user_id });

      req.user = {
        user_id: decoded.user_id,
        name: user?.name,
        email: user?.email,
        mobile: user?.mobile,
        role: user?.role,
        signWith: req.accessToken.signWith,
        isTwoFactorAuth: user?.isTwoFactorAuth,
        lastSeen: new Date().toISOString(),
      };

      next();
    } catch (error: any) {
      if (error.code === "auth/id-token-expired") {
        res
          .status(401)
          .json({ message: "Token expired. Please refresh your token." });
        return;
      }
      res.status(500).json({ message: "Authentication error." });
    }
  }

  // public static async authorization(
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> {
  //   try {
  //     const allowedRoles: string[] = [
  //       "USER",
  //       "ADMIN",
  //       "MANAGER",
  //       "CALL_CENTER",
  //     ];
  //     const userId = req.user?.user_id;
  //     const role = req.user?.role.role;

  //     if (!userId) {
  //       res.status(401).json({ message: "unauthorized: Missing user ID" });
  //       return;
  //     }

  //     if (!allowedRoles.includes(role)) {
  //       res.status(403).json({ message: "Forbidden: Access denied" });
  //       return;
  //     }
  //     next();
  //   } catch (error) {
  //     res.status(500).json({ message: "Internal server error" });
  //   }
  // }

  public allowTo(role: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user?.role;
      if (!userRole) {
        res.status(401).json({ error: "unauthorized: No user role found" });
        return;
      }
      if (!role.includes(userRole)) {
        // Update Dashboard
        this.DashboardService.updateDashboardRecordsInCaching({
          totalAccessDenied: 1,
        });

        res.status(403).json({ error: "Forbidden: Access denied" });
        return;
      }
      next();
    };
  }

  async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.RefreshToken;
      if (!refreshToken) {
        // Update Dashboard

        this.DashboardService.updateDashboardRecordsInCaching({
          totalUnauthorized: 1,
        });
        res
          .status(401)
          .json({ message: "unauthorized: No refresh token provided." });
        return;
      }

      const isJwtToken = await AuthenticationMiddleware.refreshTokenWithPhone(
        req,
        refreshToken
      );
      if (isJwtToken) {
        return next();
      }

      const isFirebaseToken =
        await AuthenticationMiddleware.refreshTokenWithEmail(req, refreshToken);
      if (isFirebaseToken) {
        return next();
      }

      res.status(403).json({ message: "Invalid refresh token." });
      return;
    } catch (error) {
      res.status(500).json({
        message: "Server error while refreshing token.",
        error: error,
      });
    }
  }

  // Check if the token is of type JWT (phone login)
  private static async refreshTokenWithPhone(
    req: Request,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const decoded = jwt.verify(refreshToken, process.env.SLAT as string, {
        algorithms: ["HS256"],
      }) as any;

      if (decoded?.user_id) {
        const payload = {
          user_id: decoded.user_id,
          email: decoded.email,
          mobile: decoded.mobile,
          role: decoded.role,
        };

        const newAccessToken = jwt.sign(payload, process.env.SLAT as string, {
          expiresIn: "1m",
          algorithm: "HS256",
        });

        req.accessToken = { token: newAccessToken, signWith: "phone" };
        return true;
      }
    } catch (error) {
      return false;
    }
    return false;
  }

  // If not JWT, try with Firebase (email login)
  private static async refreshTokenWithEmail(
    req: Request,
    refreshToken: string
  ): Promise<boolean> {
    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        { grant_type: "refresh_token", refresh_token: refreshToken }
      );

      if (response.data?.id_token) {
        req.accessToken = { token: response.data.id_token, signWith: "email" };
        return true;
      }
    } catch (firebaseError) {
      return false;
    }
    return false;
  }
}
export default AuthenticationMiddleware;
