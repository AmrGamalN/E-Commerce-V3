import express, { Request, Response } from "express";
import AddressController from "../controllers/address.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { addressValidator } from "../validations/address.valid";
import {
  resultValidator,
  mongoIdValidator,
} from "../validations/general.valid";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";
const controller = AddressController.getInstance();
const router = express.Router();

// Count address
router.get(
  "/count",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countAddress(req, res);
  }
);

// Add address
router.post(
  "/add",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.addAddress(req, res);
  }
);

// Update address
router.put(
  "/update/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.updateAddress(req, res);
  }
);

// Delete address
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.deleteAddress(req, res);
  }
);

// Get address
router.get(
  "/get/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.getAddress(req, res);
  }
);

// Get all address
router.get(
  "/get-all",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllAddress(req, res);
  }
);

export default router;
