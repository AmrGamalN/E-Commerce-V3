import { body, check } from "express-validator";
import { checkArray } from "../general.validator";

export const loginEmailValidator = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("PLEASE ENTER A VALID EMAIL")
    .matches(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/)
    .withMessage("PLEASE ENTER A VALID EMAIL"),

  body("password").notEmpty().withMessage("PASSWORD IS REQUIRED"),
];

export const loginPhoneValidator = [
  body("mobile")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS."),

  body("password").notEmpty().withMessage("PASSWORD IS REQUIRED"),
];

export const verifyEmailValidator = [
  check("email")
    .trim()
    .isEmail()
    .withMessage("PLEASE ENTER A VALID EMAIL")
    .matches(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/)
    .withMessage("PLEASE ENTER A VALID EMAIL"),

  check("userId")
    .trim()
    .notEmpty()
    .withMessage("USER ID IS REQUIRED")
    .matches(/^[a-zA-Z0-9]{28}$/)
    .withMessage("INVALID FIREBASE UID"),
];

export const sendOtpValidator = [
  check("mobile")
    .trim()
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS.")
    .whitelist("0-9+")
    .withMessage("INVALID PHONE NUMBER")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER"),

  check("userId")
    .trim()
    .notEmpty()
    .withMessage("USER ID IS REQUIRED")
    .matches(/^[a-zA-Z0-9]{28}$/)
    .withMessage("INVALID FIREBASE UID"),
];

export const verifyPhoneValidator = [
  body("otp")
    .trim()
    .matches(/^[a-zA-z0-9]/)
    .withMessage("INVALID OTP NUMBER")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP MUST BE 6 DIGITS."),

  check("mobile")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS."),
];

export const OTPValidator = [
  body("token")
    .trim()
    .isInt()
    .withMessage("INVALID OTP NUMBER")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP MUST BE 6 DIGITS."),
];

const registerValidator = (phone: boolean) => [
  check("email")
    .trim()
    .isEmail()
    .withMessage("PLEASE ENTER A VALID EMAIL")
    .matches(/^[a-zA-Z0-9._%+-]+@(gmail|yahoo)\.com$/)
    .withMessage("PLEASE ENTER A VALID EMAIL"),

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

  check("mobile")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS.")
    .optional(phone),

  check("name")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("NAME IS REQUIRED")
    .isLength({ min: 1, max: 25 })
    .withMessage("NAME MUST BE BETWEEN 1 AND 25 CHARACTERS.")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("gender")
    .isString()
    .trim()
    .notEmpty()
    .withMessage("GENDER IS REQUIRED")
    .matches(/^(male|female)$/)
    .withMessage("GENDER MUST BE EITHER 'MALE' OR 'FEMALE'"),

  check("business")
    .customSanitizer((value) => value === "true")
    .isBoolean()
    .withMessage("BUSINESS MUST BE TRUE OR FALSE"),

  check("personal")
    .customSanitizer((value) => value === "true")
    .isBoolean()
    .withMessage("PERSONAL MUST BE TRUE OR FALSE"),

  check("profileImage").isString().optional(),

  check("coverImage").isString().optional(),

  check("paymentOptions")
    .customSanitizer((value) =>
      typeof value === "string" ? value.split(",") : value
    )
    .isArray({ min: 1 })
    .withMessage("PAYMENT OPTIONS ARE REQUIRED")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  check("description")
    .optional()
    .trim()
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 1, max: 100 })
    .withMessage("DESCRIPTION MUST BE BETWEEN 1 AND 100 CHARACTERS."),

  check("addressIds")
    .customSanitizer((value) =>
      typeof value === "string" ? value.split(",") : value
    )
    .isArray({ min: 1 })
    .withMessage("ADDRESS IDS ARE REQUIRED"),

  check("allowedToShow")
    .customSanitizer((value) =>
      typeof value === "string" ? value.split(",") : value
    )
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

export const registerEmailValidator = registerValidator(true);
export const registerPhoneValidator = registerValidator(false);
