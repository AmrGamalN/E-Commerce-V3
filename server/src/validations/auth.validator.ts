import { body, check } from "express-validator";
import { checkArray } from "./general.validator";

export const loginValidator = [
  body("email").isEmail().withMessage("PLEASE ENTER A VALID EMAIL"),
  body("password").notEmpty().withMessage("PASSWORD IS REQUIRED"),
];

export const registerValidator = [
  check("email").trim().isEmail().withMessage("PLEASE ENTER A VALID EMAIL"),
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

  check("phone")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS."),

  check("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("NAME IS REQUIRED")
    .isLength({ min: 1, max: 25 })
    .withMessage("NAME MUST BE BETWEEN 1 AND 25 CHARACTERS.")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("gender")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("GENDER IS REQUIRED")
    .matches(/^(male|female)$/)
    .withMessage("GENDER MUST BE EITHER 'MALE' OR 'FEMALE'"),

  check("business")
    .isBoolean()
    .withMessage("BUSINESS MUST BE TRUE OR FALSE")
    .toBoolean(),

  check("personal")
    .isBoolean()
    .withMessage("PERSONAL MUST BE TRUE OR FALSE")
    .toBoolean(),

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
