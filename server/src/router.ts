import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth.routes";
import ItemRouters from "./routes/item.routes";
import CategoryRouters from "./routes/category.routes";
import addressRouters from "./routes/address.routes";
import reviewRouters from "./routes/review.routes";
import userRouters from "./routes/user.routes";
import notificationRouters from "./routes/notification.routes";
import AuthenticationMiddleware from "./middlewares/auth.middleware";
const router = Router();

// Health Check
router.get(
  "/health-check",
  AuthenticationMiddleware.verifyIdToken,
  AuthenticationMiddleware.allowTo(["ADMIN", "MANAGER"]),
  (req: Request, res: Response) => {
    console.log("Server is running");
    res.send("Server is running");
  }
);

// Define routes
router.use("/user", userRouters);
router.use("/auth", AuthRouters);
router.use("/item", ItemRouters);
router.use("/category", CategoryRouters);
router.use("/address", addressRouters);
router.use("/review", reviewRouters);
router.use("/notification", notificationRouters);

// router.use("/order");
// router.use("/cart");

export default router;
