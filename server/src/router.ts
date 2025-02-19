import express, { Router } from "express"
const router = express.Router();

// Define routes
router.route("/user")
router.route("/category")
router.route("/item")
router.route("/address")
router.route("/order")
router.route("/cart")

export default router;