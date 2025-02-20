import { NextFunction, Request, Response } from "express";
import { auth } from "../config/firebaseConfig";

// Used to add user in request to handle in typescript
declare module "express-serve-static-core" {
  interface Request {
    user?: any;
  }
}
class AuthenticationMiddleware {
  async static(req: Request, res: Response, next: NextFunction): Promise<void> {
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
      req.user = user;
    } catch (error) {
      res.status(500).json({ message: "Authentication error." });
    }
  }
}

export default AuthenticationMiddleware;
