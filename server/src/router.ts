import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth.routes";
import ItemRouters from "./routes/item.routes";
import CategoryRouters from "./routes/category.routes";
import addressRouters from "./routes/address.routes";
const router = Router();

// Health Check
router.get("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Define routes
router.use("/auth", AuthRouters);
router.use("/item", ItemRouters);
router.use("/category", CategoryRouters);
router.use("/address", addressRouters);

// router.use("/user");
// router.use("/order");
// router.use("/cart");

export default router;
