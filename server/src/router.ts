import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth.routes";
import ItemRouters from "./routes/item.routes";
import CategoryRouters from "./routes/category.routes";
import ConversationRouters from "./routes/conversation.routes";
import addressRouters from "./routes/address.routes";
import ReviewRouters from "./routes/review.routes";
import UserRouters from "./routes/user.routes";
import NotificationRouters from "./routes/notification.routes";
import MessageRouters from "./routes/message.routes";
import ReportRouters from "./routes/report.routes";
import FollowRouters from "./routes/follow.routes";
import OrderRouters from "./routes/order.routes";
import CouponRouters from "./routes/coupon.routes";
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
router.use("/user", UserRouters);
router.use("/auth", AuthRouters);
router.use("/item", ItemRouters);
router.use("/category", CategoryRouters);
router.use("/address", addressRouters);
router.use("/review", ReviewRouters);
router.use("/notification", NotificationRouters);
router.use("/conversation", ConversationRouters);
router.use("/message", MessageRouters);
router.use("/report", ReportRouters);
router.use("/follow", FollowRouters);
router.use("/order", OrderRouters);
router.use("/coupon", CouponRouters);

// router.use("/cart");
// router.use("/payment");

export default router;
