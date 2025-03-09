import express from "express";
import NotificationController from "../controllers/notification.controller";
import AuthenticationMiddleware from "../middlewares/authentication";
import { idValidator } from "../validations/general.validator";
import { asyncHandler } from "../middlewares/handleError";
const controller = NotificationController.getInstance();
const router = express.Router();

// // Count address
// router.get(
//   "/count",
//   AuthenticationMiddleware.refreshToken,
AuthenticationMiddleware.verifyIdToken,
  //   AuthenticationMiddleware.authorization,
  //   AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  //   async (req: Request, res: Response) => {
  //     await controller.countAddress(req, res);
  //   }
  // );

  // Add address
  router.post(
    "/register-token",
    AuthenticationMiddleware.refreshToken,
    AuthenticationMiddleware.verifyIdToken,
    AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
    asyncHandler(controller.storeFcmToken.bind(controller))
  );

router.post(
  "/send-notification",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  asyncHandler(controller.sendNotification.bind(controller))
);

// // Update address
// router.put(
//   "/update/:id",
//   AuthenticationMiddleware.refreshToken,
// AuthenticationMiddleware.verifyIdToken,
//   AuthenticationMiddleware.authorization,
//   AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
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
//   AuthenticationMiddleware.refreshToken,
// AuthenticationMiddleware.verifyIdToken,
//   AuthenticationMiddleware.authorization,
//   AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
//   idValidator,
//   resultValidator,
//   async (req: Request, res: Response) => {
//     await controller.deleteAddress(req, res);
//   }
// );

// // Get address
// router.get(
//   "/get/:id",
//   AuthenticationMiddleware.refreshToken,
// AuthenticationMiddleware.verifyIdToken,
//   AuthenticationMiddleware.authorization,
//   AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   idValidator,
//   resultValidator,
//   async (req: Request, res: Response) => {
//     await controller.getAddress(req, res);
//   }
// );

// // Get all address
// router.get(
//   "/get-all",
//   AuthenticationMiddleware.refreshToken,
// AuthenticationMiddleware.verifyIdToken,
//   AuthenticationMiddleware.authorization,
//   AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
//   async (req: Request, res: Response) => {
//     await controller.getAllAddress(req, res);
//   }
// );

export default router;
