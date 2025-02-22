import express, { Request, Response } from "express";
import ItemController from "../controllers/item.controller";
import AuthenticationMiddleware from "../middlewares/auth.middleware";
import { itemParser } from "../middlewares/parser.middleware";
import { itemValidator } from "../validations/item.valid";
import { resultValidator, mongoIdValidator } from "../validations/general.valid";
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
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  uploadFile(upload.fields([{ maxCount: 5, name: "itemImages" }])),
  itemParser,
  itemValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.addItem(req, res);
  }
);

// Update item
router.put(
  "/update/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  uploadFile(upload.fields([{ maxCount: 5, name: "itemImages" }])),
  itemParser,
  itemValidator,
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.updateItem(req, res);
  }
);

// Filter item
router.get(
  "/filter",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.filterItem(req, res);
  }
);

// Delete item
router.delete(
  "/delete/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.deleteItem(req, res);
  }
);

// Get item
router.get(
  "/get/:id",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER", "CALL_CENTER"]),
  mongoIdValidator,
  resultValidator,
  async (req: Request, res: Response) => {
    await controller.getItem(req, res);
  }
);

// Get all items
router.get(
  "/get-all",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.authorization,
  AuthenticationMiddleware.allowTo(["USER", "ADMIN", "MANAGER"]),
  async (req: Request, res: Response) => {
    await controller.getAllItem(req, res);
  }
);

export default router;
