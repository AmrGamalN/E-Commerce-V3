import { check } from "express-validator";

export const orderValidator = [
  check("itemId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage("Invalid MongoDB ID format"),

  check("paymentId")
    .trim()
    .notEmpty()
    .withMessage("PAYMENT ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage("Invalid MongoDB ID format"),

  check("quantity")
    .trim()
    .notEmpty()
    .withMessage("QUANTITY IS REQUIRED")
    .isInt({ min: 1, max: 10 })
    .withMessage("QUANTITY MUST BE AN INTEGER BETWEEN 1 AND 10")
    .toInt(),

  check("currency")
    .trim()
    .isIn(["EGP"])
    .withMessage("CURRENCY MUST CONTAIN ONLY 'EGP'"),

  check("buyerAddress")
    .trim()
    .notEmpty()
    .withMessage("LOCATION IS REQUIRED")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
    .isLength({ min: 2, max: 30 })
    .withMessage("LOCATION MUST BE BETWEEN 2 AND 50 CHARACTERS."),
];

export const orderUpdateValidator = [
  check("itemId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("orderId")
    .trim()
    .notEmpty()
    .withMessage("ORDER ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("quantity")
    .trim()
    .notEmpty()
    .withMessage("QUANTITY IS REQUIRED")
    .isInt({ min: 1, max: 10 })
    .withMessage("QUANTITY MUST BE AN INTEGER BETWEEN 1 AND 10")
    .toInt(),

  check("currency")
    .trim()
    .isIn(["EGP"])
    .withMessage("CURRENCY MUST CONTAIN ONLY 'EGP'"),

  check("buyerAddress")
    .trim()
    .notEmpty()
    .withMessage("LOCATION IS REQUIRED")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
    .isLength({ min: 2, max: 30 })
    .withMessage("LOCATION MUST BE BETWEEN 2 AND 50 CHARACTERS."),
];

export const orderStatusValidator = [
  check("orderId")
    .trim()
    .notEmpty()
    .withMessage("ORDER ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("status")
    .trim()
    .isIn(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"])
    .withMessage(
      "STATUS MUST CONTAIN ONLY 'PENDING' 'PROCESSING' 'SHIPPED' 'DELIVERED' 'CANCELLED'"
    ),
];
