import { Request, Response, Router } from "express";
import AuthRouters from "./routes/auth.routes";
import ItemRouters from "./routes/item.routes";
const router = Router();

// Health Check
router.get("/health-check", (req: Request, res: Response) => {
  console.log("Server is running");
  res.send("Server is running");
});

// Define routes
router.use("/auth", AuthRouters);
router.use("/item", ItemRouters);
// router.use("/user");
// router.use("/category");
// router.use("/address");
// router.use("/order");
// router.use("/cart");

export default router;
