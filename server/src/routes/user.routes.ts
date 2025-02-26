import express, { Request, Response } from "express";
import UserController from "../controllers/user.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import {
  userValidator,
  userPasswordValidator,
} from "../validations/user.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { UserUpdateDto } from "../dto/user.dto";
import { userUpdateParser } from "../middlewares/parser.middleware";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";

const controller = UserController.getInstance();
const router = express.Router();

// Count all users
router.post(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.resetPasswordUserByLink(req, res);
  }
);

// Reset password by link when user is forget password
router.post(
  "/reset-password",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.resetPasswordUserByLink(req, res);
  }
);

// Update password when user is login
router.post(
  "/update-password",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  userPasswordValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.userUpdatePassword(req, res);
  }
);

// Update user
router.put(
  "/update",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  uploadFile(
    upload.fields([
      { maxCount: 1, name: "profileImage" },
      { maxCount: 1, name: "coverImage" },
    ])
  ),
  userUpdateParser,
  userValidator,
  expressValidator,
  validatorBody(UserUpdateDto),
  async (req: Request, res: Response) => {
    await controller.updateUser(req, res);
  }
);

// Delete user
router.delete(
  "/delete",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteUser(req, res);
  }
);

// Get user
router.get(
  "/get",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getUser(req, res);
  }
);

// Get all userS
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllUser(req, res);
  }
);

export default router;
