import { check } from "express-validator";

export const reportValidator = [
  check("reason")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("REASON IS REQUIRED")
    .isLength({ min: 1, max: 500 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 500 CHARACTERS."
    ),
  check("subject")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("SUBJECT IS REQUIRED")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 1, max: 20 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 500 CHARACTERS."
    ),
  check("reportType")
    .trim()
    .notEmpty()
    .withMessage("TYPE IS REQUIRED")
    .isIn(["item", "conversation"]),
];
