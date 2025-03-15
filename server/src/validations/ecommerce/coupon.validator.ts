import { check } from "express-validator";

const couponValidatorFactory = (isUpdate = false) => [
  check("couponId")
    .if(() => isUpdate)
    .trim()
    .notEmpty()
    .withMessage("COUPON ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("itemId")
    .if(() => !isUpdate)
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("discount")
    .trim()
    .notEmpty()
    .withMessage("DISCOUNT IS REQUIRED")
    .isInt({ min: 1, max: 100 })
    .withMessage("Discount Percentage must be an integer between 1 and 100")
    .toInt()
    .optional(isUpdate),

  check("maxUses")
    .trim()
    .notEmpty()
    .withMessage("Max Uses IS REQUIRED")
    .isInt({ min: 1 })
    .withMessage("Max Uses must be an integer number greater than 0")
    .toInt()
    .optional(isUpdate),

  check("expiresAt")
    .trim()
    .notEmpty()
    .withMessage("Expiration date is required")
    .isISO8601()
    .withMessage("Invalid date format, e.g., YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss.sssZ")
    .toDate()
    .custom((value) => {
      if (value < new Date()) {
        throw new Error("Expiration date cannot be in the past");
      }
      return true;
    })
    .optional(isUpdate),
].filter(Boolean);


export const couponApplyValidator = [
  check("couponId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("orderId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("code")
    .trim()
    .notEmpty()
    .withMessage("CODE IS REQUIRED")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("INVALID CODE")
    .isLength({ min: 9, max: 9 })
    .withMessage("INVALID CODE"),

  check("quantity")
    .trim()
    .notEmpty()
    .withMessage("QUANTITY IS REQUIRED")
    .isInt({ min: 1, max: 10 })
    .withMessage("QUANTITY MUST BE AN INTEGER BETWEEN 1 AND 10")
    .toInt(),

  check("price")
    .notEmpty()
    .withMessage("PRICE IS REQUIRED")
    .isInt({ min: 1 })
    .withMessage("PRICE MUST BE A NUMBER"),
];

export const couponAddValidator = couponValidatorFactory(false);
export const couponUpdateValidator = couponValidatorFactory(true);