import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth/authMain.routes";
import ItemRouters from "./routes/ecommerce/item.routes";
import CategoryRouters from "./routes/category/category.routes";
import ConversationRouters from "./routes/messaging/conversation.routes";
import addressRouters from "./routes/user/address.routes";
import ReviewRouters from "./routes/ecommerce/review.routes";
import UserRouters from "./routes/user/user.routes";
import NotificationRouters from "./routes/messaging/notification.routes";
import MessageRouters from "./routes/messaging/message.routes";
import ReportRouters from "./routes/ecommerce/report.routes";
import FollowRouters from "./routes/user/follow.routes";
import OrderRouters from "./routes/ecommerce/order.routes";
import CouponRouters from "./routes/ecommerce/coupon.routes";
import WishListRouters from "./routes/ecommerce/wishList.routes";
import DashboardRouters from "./routes/dashboard/dashboard.routes";
import ScheduleRouters from "./routes/dashboard/schedule.routes";
import CachingRouters from "./routes/dashboard/redisCaching.routes";
import FirebaseRouters from "./routes/dashboard/firebase.routes";
import PaymentRouters from "./routes/payment/payment.routes";
import AuthenticationMiddleware from "./middlewares/authentication";
const authMiddlewareService = AuthenticationMiddleware.getInstance();

const router = Router();

// Health Check
router.get(
  "/health-check",
  authMiddlewareService.refreshToken,
  authMiddlewareService.verifyIdToken,
  authMiddlewareService.allowTo(["ADMIN", "MANAGER"]),
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
router.use("/wishlist", WishListRouters);
router.use("/dashboard", DashboardRouters);
router.use("/schedule", ScheduleRouters);
router.use("/cache", CachingRouters);
router.use("/firebase", FirebaseRouters);
router.use("/payment", PaymentRouters);

export default router;
