import { body } from "express-validator";

export const reviewValidator = [
  body("rate")
    .isNumeric()
    .withMessage("Rate must be a number")
    .notEmpty()
    .withMessage("Rate is required")
    .isFloat({ min: 0, max: 5 })
    .withMessage("Rate must be between 0 and 5"),
  body("description")
    .isString()
    .notEmpty()
    .withMessage("DESCRIPTION IS REQUIRED"),
  body("title")
    .trim()
    .notEmpty()
    .withMessage("TITLE IS REQUIRED")
    .isIn(["bad", "average", "good", "very good", "excellent"])
    .withMessage(
      "CONDITION MUST BE 'bad','Average','Good','very good','Excellent'"
    ),
];
