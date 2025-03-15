import { body } from "express-validator";
// .matches(/^[a-zA-Z0-9\u0600-\u06FF\s]+$/) // SUPPORT ARABIC
export const addressValidator = [
  body("street")
    .trim()
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS, NUMBERS,")
    .isLength({ min: 2, max: 100 })
    .withMessage("STREET MUST BE BETWEEN 2 AND 100 CHARACTERS."),

  body("suite")
    .trim()
    .matches(/^[a-zA-Z0-9\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS, NUMBERS, AND SPACES.")
    .isLength({ min: 1, max: 20 })
    .withMessage("SUITE MUST BE BETWEEN 1 AND 20 CHARACTERS."),

  body("houseNumber")
    .trim()
    .isInt({ min: 1 })
    .withMessage("HOUSE NUMBER MUST BE A POSITIVE INTEGER")
    .toInt(),

  body("city")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND SPACES.")
    .isLength({ min: 2, max: 20 })
    .withMessage("CITY MUST BE BETWEEN 2 AND 20 CHARACTERS."),

  body("state")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND SPACES.")
    .isLength({ min: 2, max: 20 })
    .withMessage("STATE MUST BE BETWEEN 2 AND 20 CHARACTERS."),

  body("country")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND SPACES.")
    .isLength({ min: 2, max: 20 })
    .withMessage("COUNTRY MUST BE BETWEEN 2 AND 20 CHARACTERS."),

  body("phone")
    .trim()
    .whitelist("0-9+")
    .isMobilePhone("ar-EG")
    .withMessage("INVALID PHONE NUMBER")
    .isLength({ min: 13, max: 13 })
    .withMessage("PHONE NUMBER MUST BE 13 DIGITS."),

  body("type")
    .trim()
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS AND SPACES.")
    .isLength({ min: 2, max: 20 })
    .withMessage("TYPE MUST BE BETWEEN 2 AND 20 CHARACTERS."),

  body("isDefault")
    .trim()
    .isBoolean()
    .withMessage("ISDEFAULT MUST BOOLEAN")
    .toBoolean(),
];
