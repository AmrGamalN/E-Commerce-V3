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

  check("name").isString().trim().notEmpty().withMessage("NAME IS REQUIRED"),
  check("gender")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("GENDER IS REQUIRED")
    .matches(/^(male|female)$/)
    .withMessage("GENDER MUST BE EITHER 'MALE' OR 'FEMALE'"),

  check("business").isBoolean().withMessage("BUSINESS MUST BE TRUE OR FALSE"),
  check("personal").isBoolean().withMessage("PERSONAL MUST BE TRUE OR FALSE"),
  check("profileImage").isString().optional(),
  check("coverImage").isString().optional(),
  check("paymentOptions")
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS ARE REQUIRED"),

  check("description").optional().trim(),
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
