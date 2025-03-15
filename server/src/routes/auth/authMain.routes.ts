import express from "express";
import { sendOtpValidator } from "../../validations/auth/auth.validator";
import { expressValidator } from "../../middlewares/expressValidator";
import { asyncHandler } from "../../middlewares/handleError";
import loginRoutes from "./login.routes";
import registerRoutes from "./register.routes";
import securityRoutes from "./security.routes";
import verifyRoutes from "./verify.routes";
import LoginController from "../../controllers/auth/login.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
import VerifyController from "../../controllers/auth/verify.controller";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const loginController = LoginController.getInstance();
const verifyController = VerifyController.getInstance();
const router = express.Router();

router.use("/login", loginRoutes);
router.use("/register", registerRoutes);
router.use("/security", securityRoutes);
router.use("/verify", verifyRoutes);

// Logout
router.post(
  "/logout",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  asyncHandler(loginController.logOut.bind(loginController))
);

// Send otp to  phone
router.post(
  "/send-otp",
  sendOtpValidator,
  expressValidator,
  asyncHandler(verifyController.sendOtpAgain.bind(verifyController))
);

export default router;
