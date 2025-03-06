import express, { Request, Response } from "express";
import FollowController from "../controllers/follow.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { idValidator } from "../validations/general.validator";
import { followValidator } from "../validations/follow.validator";

const controller = FollowController.getInstance();
const router = express.Router();

// Count follow
router.get(
  "/count",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.countFollow(req, res);
  }
);

// Count follow
router.get(
  "/search",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.searchFollow(req, res);
  }
);

// Add follow
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  followValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.addFollow(req, res);
  }
);

// Delete follow
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER","CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteFollow(req, res);
  }
);

// Get follow
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  followValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getFollow(req, res);
  }
);

// Get all follow
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllFollow(req, res);
  }
);

export default router;
