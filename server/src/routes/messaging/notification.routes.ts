import express from "express";
import NotificationController from "../../controllers/messaging/notification.controller";
import AuthenticationMiddleware from "../../middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();
import { idValidator } from "../../validations/general.validator";
import { asyncHandler } from "../../middlewares/handleError";
const controller = NotificationController.getInstance();
const router = express.Router();

// // Count address
// router.get(
//   "/count",
//   authMiddlewareService.refreshToken,
authMiddlewareService.verifyIdToken,
  //   authMiddlewareService.authorization,
  //   authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  //   async (req: Request, res: Response) => {
  //     await controller.countAddress(req, res);
  //   }
  // );

  // Add address
  router.post(
    "/register-token",
    authMiddlewareService.refreshToken,
    authMiddlewareService.verifyIdToken,
    authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
    asyncHandler(controller.storeFcmToken.bind(controller))
  );

router.post(
  "/send-notification",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.sendNotification.bind(controller))
);

// // Update address
// router.put(
//   "/update/:id",
//   authMiddlewareService.refreshToken,
// authMiddlewareService.verifyIdToken,
//   authMiddlewareService.authorization,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   addressValidator,
//   idValidator,
//   resultValidator,
//   async (req: Request, res: Response) => {
//     await controller.updateAddress(req, res);
//   }
// );

// // Delete address
// router.delete(
//   "/delete/:id",
//   authMiddlewareService.refreshToken,
// authMiddlewareService.verifyIdToken,
//   authMiddlewareService.authorization,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER"]),
//   idValidator,
//   resultValidator,
//   async (req: Request, res: Response) => {
//     await controller.deleteAddress(req, res);
//   }
// );

// // Get address
// router.get(
//   "/get/:id",
//   authMiddlewareService.refreshToken,
// authMiddlewareService.verifyIdToken,
//   authMiddlewareService.authorization,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   idValidator,
//   resultValidator,
//   async (req: Request, res: Response) => {
//     await controller.getAddress(req, res);
//   }
// );

// // Get all address
// router.get(
//   "/get-all",
//   authMiddlewareService.refreshToken,
// authMiddlewareService.verifyIdToken,
//   authMiddlewareService.authorization,
//   authMiddlewareService.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   async (req: Request, res: Response) => {
//     await controller.getAllAddress(req, res);
//   }
// );

export default router;
