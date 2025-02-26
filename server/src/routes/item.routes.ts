import express, { Request, Response } from "express";
import ItemController from "../controllers/item.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { itemParser } from "../middlewares/parser.middleware";
import { itemValidator } from "../validations/item.validator";
import { idValidator } from "../validations/general.validator";
import { expressValidator } from "../middlewares/express.validator.middleware";
import { validatorBody } from "../middlewares/zod.validator.middleware";
import { ItemAddDto } from "../dto/item.dto";
import { uploadFile, upload } from "../middlewares/uploadFile.middleware";
const controller = ItemController.getInstance();
const router = express.Router();

// Count items
router.get("/count", async (req: Request, res: Response) => {
  await controller.countItems(req, res);
});

// Add item
router.post(
  "/add",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  uploadFile(upload.fields([{ maxCount: 5, name: "itemImages" }])),
  itemParser,
  itemValidator,
  expressValidator,
  validatorBody(ItemAddDto),
  async (req: Request, res: Response) => {
    await controller.addItem(req, res);
  }
);

// Update item
router.put(
  "/update/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  uploadFile(upload.fields([{ maxCount: 5, name: "itemImages" }])),
  itemParser,
  itemValidator,
  idValidator,
  expressValidator,
  validatorBody(ItemAddDto),
  async (req: Request, res: Response) => {
    await controller.updateItem(req, res);
  }
);

// Filter item
router.get(
  "/filter",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.filterItem(req, res);
  }
);

// Delete item
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.deleteItem(req, res);
  }
);

// Get item
router.get(
  "/get/:id",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  idValidator,
  expressValidator,
  async (req: Request, res: Response) => {
    await controller.getItem(req, res);
  }
);

// Get all items
router.get(
  "/get-all",
  AuthenticationMiddleware.refreshToken,
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllItem(req, res);
  }
);

export default router;
