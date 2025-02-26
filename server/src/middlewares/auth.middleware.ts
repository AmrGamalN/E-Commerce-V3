import { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebaseConfig";
import User from "../models/mongodb/user.model";
import axios from "axios";

// Used to add user in request to handle in typescript
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
    accessToken?: any;
  }
}
class AuthenticationMiddleware {
  public static async verifyIdToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accessToken = req.accessToken;
      if (!accessToken) {
        res.status(401).json({ message: "Unauthorized: No token provided." });
        return;
      }

      const decoded = await auth.verifyIdToken(accessToken);
      if (!decoded) {
        res.status(401).json({ message: "Invalid Auth Token." });
        return;
      }

      const role = await User.findOne(
        { userId: decoded?.user_id },
        { role: 1, _id: 0 }
      );
      req.user = { user_id: decoded.user_id, role: role, email: decoded.email };
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

  public static async authorization(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const allowedRoles: string[] = [
        "USER",
        "ADMIN",
        "MANAGER",
        "CALL_CENTER",
      ];
      const userId = req.user?.user_id;
      const role = req.user?.role.role;

      if (!userId) {
        res.status(401).json({ message: "Unauthorized: Missing user ID" });
        return;
      }

      if (!allowedRoles.includes(role)) {
        res.status(403).json({ message: "Forbidden: Access denied" });
        return;
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  public static allowTo(role: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {
      const userRole = req.user?.role.role;
      if (!userRole) {
        res.status(401).json({ error: "Unauthorized: No user role found" });
        return;
      }
      if (!role.includes(userRole)) {
        res.status(403).json({ error: "Forbidden: Access denied" });
        return;
      }
      next();
    };
  }

  // refresh token
  public static async refreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies?.RefreshToken;
      if (!refreshToken) {
        res.status(401).json({ message: "Unauthorized: No refresh token." });
        return;
      }

      // Create new access token
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=${process.env.FIREBASE_API_KEY}`,
        {
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }
      );

      if (!response) {
        res.status(403).json({ message: "Invalid or expired refresh token." });
        return;
      }

      req.accessToken = response.data.id_token;
      next();
    } catch (error) {
      res.status(500).json({ message: "Invalid or expired refresh token." });
    }
  }
}
export default AuthenticationMiddleware;
