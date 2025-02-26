import { check } from "express-validator";
import { checkArray } from "./general.validator";

export const userValidator = [
  check("name")
    .isString()
    .trim()
    .isLength({ min: 1, max: 25 })
    .withMessage("NAME MUST BE BETWEEN 1 AND 25 CHARACTERS.")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .optional(),

  check("mobile")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS.")
    .optional(),

  check("profileImage").isString().optional(),

  check("coverImage").isString().optional(),

  check("paymentOptions")
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS ARE REQUIRED")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("description")
    .optional()
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 1, max: 100 })
    .withMessage("DESCRIPTION MUST BE BETWEEN 1 AND 100 CHARACTERS."),

  check("addressIds")
    .isArray({ min: 1 })
    .withMessage("ADDRESS IDS ARE REQUIRED"),

  check("allowedToShow")
    .isArray({ min: 1 })
    .withMessage("ALLOWED TO SHOW IS REQUIRED"),

  checkArray(
    "allowedToShow",
    "ALLOWED TO SHOW MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),

  checkArray(
    "paymentOptions",
    "PAYMENT OPTIONS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),
  checkArray(
    "addressIds",
    "ADDRESS IDS MUST CONTAIN ONLY ALPHABETICAL CHARACTERS"
  ),
];

export const userPasswordValidator = [
  check("password")
  .notEmpty()
  .withMessage("PASSWORD IS REQUIRED")
  .isStrongPassword({
    minLength: 10,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  .withMessage(
    "PASSWORD MUST BE 10 CHARACTERS, INCLUDE AT LEAST ONE UPPERCASE LETTER, ONE NUMBER, AND ONE SPECIAL CHARACTER"
  ),
];


