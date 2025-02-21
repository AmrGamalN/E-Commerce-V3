import { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebaseConfig";
import User from "../models/mongodb/user.model";

// Used to add user in request to handle in typescript
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}

class AuthenticationMiddleware {
  public static async verifyIdToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      // prettier-ignore
      const decryptedToken = Buffer.from(req.cookies?.AuthToken, "base64").toString("utf-8");
      console.log(decryptedToken);
      if (!decryptedToken) {
        res.status(401).json({ message: "Unauthorized: No token provided." });
        return;
      }
      const user = await auth.verifyIdToken(decryptedToken);
      if (!user) {
        res.status(401).json({ message: "Invalid Auth Token." });
        return;
      }
      req.user = user;
      next();
    } catch (error) {
      res.status(500).json({ message: "Authentication error." });
    }
  }

  public static async allowTo(
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
      const userid = req.user?.user_id;

      if (!userid) {
        res.status(401).json({ message: "Unauthorized: Missing user ID" });
        return;
      }

      const user = await User.findOne({ userid }).select("userId role email");

      if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      if (!allowedRoles.includes(String(user?.role))) {
        res.status(403).json({ message: "Forbidden: Access denied" });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default AuthenticationMiddleware;
