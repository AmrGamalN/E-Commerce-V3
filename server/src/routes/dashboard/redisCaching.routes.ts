import express from "express";
import { expressValidator } from "../../middlewares/expressValidator";
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";
import AuthenticationMiddleware from "../../middlewares/authentication";
import CachingController from "../../controllers/dashboard/redisCaching.controller";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
const controller = CachingController.getInstance();
const router = express.Router();

// Create caching
router.post(
  "/create",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.createCache.bind(controller))
);

// Get caching
router.post(
  "/delete",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.deleteCache.bind(controller))
);

// Update total caching
router.post(
  "/clear",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.clearCache.bind(controller))
);

// Get caching
router.get(
  "/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getCache.bind(controller))
);

// Get users caching
router.get(
  "/users/get",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.getUsers.bind(controller))
);

// Delete users caching
router.delete(
  "/users/delete",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.deleteUsers.bind(controller))
);

export default router;
