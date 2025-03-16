import { check } from "express-validator";

const orderValidatorFactory = (isUpdate = false) =>
  [
    check("orderId")
      .if(() => isUpdate)
      .trim()
      .notEmpty()
      .withMessage("ORDER ID IS REQUIRED")
      .isMongoId()
      .withMessage("INVALID MONGODB ID")
      .withMessage("Invalid MongoDB ID format"),

    check("itemId")
      .trim()
      .notEmpty()
      .withMessage("ITEM ID IS REQUIRED")
      .isMongoId()
      .withMessage("INVALID MONGODB ID")
      .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
      .withMessage("Invalid MongoDB ID format")
      .optional(isUpdate),

    check("paymentId")
      .if(() => !isUpdate)
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
      .toInt()
      .optional(isUpdate),

    check("currency")
      .trim()
      .isIn(["EGP"])
      .withMessage("CURRENCY MUST CONTAIN ONLY 'EGP'")
      .optional(isUpdate),

    check("buyerAddress")
      .trim()
      .notEmpty()
      .withMessage("LOCATION IS REQUIRED")
      .matches(/^[a-zA-Z0-9]+$/)
      .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
      .isLength({ min: 2, max: 30 })
      .withMessage("LOCATION MUST BE BETWEEN 2 AND 50 CHARACTERS.")
      .optional(isUpdate),
  ].filter(Boolean);

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
    .isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "refund",
      "cancelled",
    ])
    .withMessage(
      "STATUS MUST CONTAIN ONLY 'pending' 'processing' 'shipped' 'delivered' 'refund' 'cancelled'"
    ),
];

export const orderFilterValidator = [
  check("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("PAGE MUST BE A POSITIVE INTEGER"),
  
  check("orderType")
    .optional()
    .isBoolean()
    .withMessage("ORDER TYPE MUST BE BOOLEAN"),

  check("from")
    .optional()
    .isDate()
    .withMessage("MUST BE DATE")
    .isISO8601()
    .withMessage(
      "Invalid date format, e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ"
    ),

  check("to")
    .optional()
    .isDate()
    .withMessage("MUST BE DATE")
    .isISO8601()
    .withMessage(
      "Invalid date format, e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ"
  ),
  
  check("status")
    .optional()
    .trim()
    .isIn([
      "pending",
      "processing",
      "shipped",
      "delivered",
      "refund",
      "cancelled",
    ])
    .withMessage(
      "STATUS MUST BE ONE OF: 'pending', 'processing', 'shipped', 'delivered', 'refund', 'cancelled'"
    ),
];

export const orderAddValidator = orderValidatorFactory(false);
export const orderUpdateValidator = orderValidatorFactory(true);
