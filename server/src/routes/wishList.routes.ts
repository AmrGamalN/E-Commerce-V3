import express from "express";
import WishListController from "../controllers/wishList.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { validatorBody } from "../middlewares/zodValidator";
import { expressValidator } from "../middlewares/expressValidator";
import { WishListAddDto } from "../dto/wishList.dto";
import { idValidator } from "../validations/general.validator";
import { asyncHandler } from "../middlewares/handleError";

const controller = WishListController.getInstance();
const router = express.Router();

// Count wishList
router.get(
  "/count/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countWishList.bind(controller))
);

// Add wishList
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  validatorBody(WishListAddDto),
  asyncHandler(controller.addWishList.bind(controller))
);

// Delete wishList
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteWishList.bind(controller))
);

// Clear wishList
router.delete(
  "/clear/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.clearWishList.bind(controller))
);

// Get wishList
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getWishList.bind(controller))
);

export default router;
