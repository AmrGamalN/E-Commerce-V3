import { check, query } from "express-validator";
import { checkArray } from "../general.validator";

export const itemValidator = [
  check("category")
    .trim()
    .notEmpty()
    .withMessage("CATEGORY IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase())
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("subcategory")
    .trim()
    .notEmpty()
    .withMessage("SUBCATEGORY IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase())
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("nestedSubCategory")
    .trim()
    .customSanitizer((value) => value.toLowerCase())
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .optional(),

  check("brand")
    .trim()
    .notEmpty()
    .withMessage("BRAND IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase())
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("communications")
    .trim()
    .customSanitizer((value) =>
      typeof value === "string" ? value.split(",") : value
    )
    .isArray({ min: 1 })
    .withMessage("COMMUNICATION MUST BE AN ARRAY")
    .matches(/^(phone|chat)$/)
    .withMessage("COMMUNICATIONS MUST CONTAIN ONLY 'phone' OR 'chat'"),
  checkArray(
    "communications",
    "COMMUNICATIONS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),

  check("title")
    .trim()
    .notEmpty()
    .withMessage("TITLE IS REQUIRED")
    .matches(/^[a-zA-Z-0-9 ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 2, max: 20 })
    .withMessage("CITY MUST BE BETWEEN 2 AND 50 CHARACTERS."),

  check("description")
    .trim()
    .notEmpty()
    .withMessage("DESCRIPTION IS REQUIRED")
    .matches(/^[a-zA-Z-0-9 ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS and NUMBER")
    .isLength({ min: 2, max: 150 })
    .withMessage("CITY MUST BE BETWEEN 2 AND 150 CHARACTERS."),

  check("condition")
    .trim()
    .notEmpty()
    .withMessage("CONDITION IS REQUIRED")
    .isIn(["NEW", "USED", "OLD"])
    .withMessage("CONDITION MUST BE 'NEW' OR 'USED' OR 'OLD'")
    .matches(/^[A-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("paymentOptions")
    .trim()
    .customSanitizer((value) =>
      typeof value === "string" ? value.split(",") : value
    )
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS MUST BE AN ARRAY")
    .matches(/^(cash|credit card|meeza|fawry|visa|we pay|paymob)$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),
  checkArray(
    "paymentOptions",
    "PAYMENT OPTIONS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),

  check("location")
    .trim()
    .notEmpty()
    .withMessage("LOCATION IS REQUIRED")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
    .isLength({ min: 2, max: 30 })
    .withMessage("LOCATION MUST BE BETWEEN 2 AND 50 CHARACTERS."),

  check("phone")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS.")
    .optional(),

  check("type")
    .optional()
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("size")
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
    .isLength({ min: 2, max: 10 })
    .withMessage("SIZE MUST BE BETWEEN 2 AND 10 CHARACTERS."),

  check("material")
    .optional()
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND NUMBER")
    .isLength({ min: 3, max: 20 })
    .withMessage("MATERIAL MUST BE BETWEEN 2 AND 10 CHARACTERS."),

  check("color")
    .optional()
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 3, max: 20 })
    .withMessage("COLOR MUST BE BETWEEN 2 AND 20 CHARACTERS."),

  check("price")
    .notEmpty()
    .withMessage("PRICE IS REQUIRED")
    .isInt({ min: 1 })
    .withMessage("PRICE MUST BE A NUMBER")
    .toInt(),

  check("allowQuantity")
    .isInt({ min: 1, max: 10 })
    .withMessage("ALLOW QUANTITY MUST BE A NUMBER")
    .toInt(),

  check("availableQuantity")
    .isInt({ min: 1 })
    .withMessage("AVAILABLE QUANTITY MUST BE A NUMBER")
    .toInt(),

  check("discount")
    .isInt()
    .withMessage("DISCOUNT MUST BE A NUMBER")
    .default(0)
    .optional()
    .toInt(),

  check("isSavedForLater").isBoolean().toBoolean().optional(),
  check("allowNegotiate").isBoolean().toBoolean().optional(),
  check("promotion").isBoolean().toBoolean().optional(),
];

export const itemStatusValidator = [
  check("itemId")
    .trim()
    .notEmpty()
    .withMessage("ORDER ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("status")
    .trim()
    .isIn(["underReview", "approved", "published", "sold", "reject"])
    .withMessage(
      "status MUST CONTAIN ONLY 'underReview' 'approved' 'published' 'reject'"
    ),
];

export const itemFilterValidator = [
  query("avgRating")
    .optional()
    .isFloat({ min: 1, max: 5 })
    .withMessage("AVG RATING MUST BE A NUMBER BETWEEN 1 AND 5")
    .toInt(),

  query("title")
    .optional()
    .isString()
    .isIn(["bad", "average", "good", "very_good", "excellent"])
    .withMessage(
      "TITLE MUST BE ONE OF: 'BAD', 'AVERAGE', 'GOOD', 'VERY_GOOD', 'EXCELLENT'"
    ),

  query("communications")
    .optional()
    .isString()
    .withMessage("COMMUNICATIONS MUST BE A STRING"),

  query("min")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("MIN MUST BE A POSITIVE NUMBER")
    .toInt(),

  query("max")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("MAX MUST BE A POSITIVE NUMBER")
    .toInt(),

  query("from")
    .optional()
    .isISO8601()
    .withMessage("FROM MUST BE A VALID DATE")
    .toDate(),

  query("to")
    .optional()
    .isISO8601()
    .withMessage("TO MUST BE A VALID DATE")
    .toDate(),

  query("discount")
    .optional()
    .isBoolean()
    .withMessage("DISCOUNT MUST BE TRUE OR FALSE")
    .toBoolean(),

  query("allowNegotiate")
    .optional()
    .isBoolean()
    .withMessage("ALLOW NEGOTIATE MUST BE TRUE OR FALSE")
    .toBoolean(),

  query("category")
    .optional()
    .isString()
    .withMessage("CATEGORY MUST BE A STRING"),

  query("subcategory")
    .optional()
    .isString()
    .withMessage("SUBCATEGORY MUST BE A STRING"),

  query("brand").optional().isString().withMessage("BRAND MUST BE A STRING"),

  query("type").optional().isString().withMessage("TYPE MUST BE A STRING"),

  query("condition")
    .optional()
    .isString()
    .withMessage("CONDITION MUST BE A STRING"),

  query("location")
    .optional()
    .isString()
    .withMessage("LOCATION MUST BE A STRING"),

  query("color").optional().isString().withMessage("COLOR MUST BE A STRING"),

  query("size").optional().isString().withMessage("SIZE MUST BE A STRING"),
];
