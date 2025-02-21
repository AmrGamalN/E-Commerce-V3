import { check } from "express-validator";
import { checkArray } from "./general.valid";

export const itemValid = [
  check("category")
    .trim()
    .notEmpty()
    .withMessage("CATEGORY IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase()),

  check("subcategory")
    .trim()
    .notEmpty()
    .withMessage("SUBCATEGORY IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase()),

  check("brand")
    .trim()
    .notEmpty()
    .withMessage("BRAND IS REQUIRED")
    .customSanitizer((value) => value.toLowerCase()),

  check("communications")
    .trim()
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS MUST BE AN ARRAY")
    .matches(/^(phone|chat)$/)
    .withMessage("COMMUNICATIONS MUST CONTAIN ONLY 'phone' OR 'chat'"),
  checkArray(
    "communications",
    "COMMUNICATIONS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),

  check("title").trim().notEmpty().withMessage("TITLE IS REQUIRED"),
  check("description").trim().notEmpty().withMessage("DESCRIPTION IS REQUIRED"),

  check("condition")
    .trim()
    .notEmpty()
    .withMessage("CONDITION IS REQUIRED")
    .isIn(["NEW", "USED", "OLD"])
    .withMessage("CONDITION MUST BE 'NEW' OR 'USED' OR 'OLD'"),

  check("paymentOptions")
    .trim()
    .optional()
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS MUST BE AN ARRAY"),
  checkArray(
    "paymentOptions",
    "PAYMENT OPTIONS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),

  check("location").trim().notEmpty().withMessage("LOCATION IS REQUIRED"),
  check("phone").optional().trim(),
  check("type").optional().trim(),
  check("size").optional().trim(),
  check("color").optional().trim(),

  check("price")
    .notEmpty()
    .withMessage("PRICE IS REQUIRED")
    .isNumeric()
    .withMessage("PRICE MUST BE A NUMBER"),

  check("discount")
    .optional()
    .isNumeric()
    .withMessage("DISCOUNT MUST BE A NUMBER")
    .default(0),

  check("isDiscount").optional().isBoolean(),
  check("isSavedForLater").optional().isBoolean(),
  check("allowNegotiate").optional().isBoolean(),
  check("promotion").optional().isBoolean(),
];
