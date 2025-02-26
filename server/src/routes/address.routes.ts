import express, { Request, Response } from "express";
import AddressController from "../controllers/address.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import {validatorBody} from "../middlewares/zod.validator.middleware";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { AddressAddDto} from "../dto/address.dto";
import { addressValidator } from "../validations/address.validator";
import { idValidator } from "../validations/general.validator";

const controller = AddressController.getInstance();
const router = express.Router();

// Count address
router.get(
  "/count",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.countAddress(req, res);
  }
);

// Add address
router.post(
  "/add",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  expressValidator,
  validatorBody(AddressAddDto),
  async (req: Request, res: Response) => {
    await controller.addAddress(req, res);
  }
);

// Update address
router.put(
  "/update/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  addressValidator,
  expressValidator,
  validatorBody(AddressAddDto),
  async (req: Request, res: Response) => {
    await controller.updateAddress(req, res);
  }
);

// Delete address
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteAddress(req, res);
  }
);

// Get address
router.get(
  "/get/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getAddress(req, res);
  }
);

// Get all address
router.get(
  "/get-all",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  async (req: Request, res: Response) => {
    await controller.getAllAddress(req, res);
  }
);

export default router;
