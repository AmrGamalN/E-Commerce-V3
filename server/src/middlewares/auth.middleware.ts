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
      if (!decryptedToken) {
        res.status(401).json({ message: "Unauthorized: No token provided." });
        return;
      }
      const user = await auth.verifyIdToken(decryptedToken);
      if (!user) {
        res.status(401).json({ message: "Invalid Auth Token." });
        return;
      }

      const role = await User.findOne(
        { userId: user?.user_id },
        { role: 1, _id: 0 }
      );
      req.user = { user_id: user.user_id, role };
      next();
    } catch (error) {
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
}
export default AuthenticationMiddleware;
