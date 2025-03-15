import { body } from "express-validator";

export const reviewAddValidator = [
  body("rate")
    .notEmpty()
    .withMessage("Rate is required")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rate must be between 0 and 5")
    .toFloat(),

  body("description")
    .isString()
    .notEmpty()
    .withMessage("DESCRIPTION IS REQUIRED")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .isLength({ min: 2, max: 15 })
    .withMessage("COLOR MUST BE BETWEEN 2 AND 10 CHARACTERS."),

  body("title")
    .trim()
    .notEmpty()
    .withMessage("TITLE IS REQUIRED")
    .isIn(["bad", "average", "good", "veryGood", "excellent"])
    .withMessage(
      "CONDITION MUST BE 'bad','Average','Good','veryGood','Excellent'"
    )
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),
];
