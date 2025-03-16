import { check } from "express-validator";

export const paymentValidator = [
  check("transactionId")
    .notEmpty()
    .withMessage("Transaction ID is required")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("orderId")
    .notEmpty()
    .withMessage("Order ID is required")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("buyerId")
    .notEmpty()
    .withMessage("Buyer ID is required")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("sellerId")
    .notEmpty()
    .withMessage("Seller ID is required")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .isFloat({ gt: 0 })
    .withMessage("Amount must be greater than zero"),

  check("transactionFee")
    .isNumeric()
    .withMessage("Transaction Fee must be a number")
    .isFloat({ min: 0 })
    .withMessage("Transaction Fee must be zero or positive"),

  check("paymentMethod")
    .isString()
    .withMessage("Payment method must be a string")
    .notEmpty()
    .withMessage("Payment method is required"),

  check("paymentGateway")
    .isString()
    .withMessage("Payment gateway must be a string")
    .notEmpty()
    .withMessage("Payment gateway is required"),

  check("gatewayResponse")
    .optional()
    .isObject()
    .withMessage("Gateway response must be an object"),

  check("status")
    .optional()
    .isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "refund",
      "cancelled",
    ])
    .withMessage("Invalid status value"),
];
