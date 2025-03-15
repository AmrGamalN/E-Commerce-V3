import { check } from "express-validator";
import { checkArray } from "../general.validator";

export const userUpdateValidator = [
  check("name")
    .notEmpty()
    .withMessage("NAME IS REQUIRED")
    .trim()
    .isString()
    .isLength({ min: 1, max: 30 })
    .withMessage("NAME MUST BE BETWEEN 1 AND 30 CHARACTERS.")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .optional(),

  check("profileImage").isString().optional(true),
  check("coverImage").isString().optional(true),

  check("paymentOptions")
    .notEmpty()
    .withMessage("PAYMENT OPTIONS ARE REQUIRED")
    .isArray({ min: 1 })
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .optional(),

  check("description")
    .trim()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 1, max: 100 })
    .withMessage("DESCRIPTION MUST BE BETWEEN 1 AND 100 CHARACTERS.")
    .optional(true),

  check("addressIds")
    .notEmpty()
    .withMessage("ADDRESS IDS ARE REQUIRED")
    .isArray({ min: 1 })
    .optional(),

  check("allowedToShow")
    .notEmpty()
    .withMessage("ALLOWED TO SHOW IS REQUIRED")
    .isArray({ min: 1 })
    .optional(),

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
