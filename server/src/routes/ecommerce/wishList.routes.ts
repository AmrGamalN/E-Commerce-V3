import express from "express";
import WishListController from "../../controllers/ecommerce/wishList.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { validatorBody } from "../../middlewares/zodValidator";
import { expressValidator } from "../../middlewares/expressValidator";
import { WishListAddDto } from "../../dto/ecommerce/wishList.dto";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";

const controller = WishListController.getInstance();
const router = express.Router();

// Count wishList
router.get(
  "/count/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  asyncHandler(controller.countWishList.bind(controller))
);

// Add wishList
router.post(
  "/add",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  validatorBody(WishListAddDto),
  asyncHandler(controller.addWishList.bind(controller))
);

// Delete wishList
router.delete(
  "/delete/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.deleteWishList.bind(controller))
);

// Clear wishList
router.delete(
  "/clear/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.clearWishList.bind(controller))
);

// Get wishList
router.get(
  "/get/:id",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  asyncHandler(controller.getWishList.bind(controller))
);

export default router;
