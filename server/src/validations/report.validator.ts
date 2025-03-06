import { check } from "express-validator";

export const reportValidator = [
  check("modelId")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage("Invalid MongoDB ID format"),

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
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 50 CHARACTERS."
    ),
  check("reportType")
    .trim()
    .notEmpty()
    .withMessage("TYPE IS REQUIRED")
    .isIn(["item", "conversation"]),
];

export const reportFeedBackValidator = [
  check("modelId")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage("Invalid MongoDB ID format"),

  check("message")
    .trim()
    .isString()
    .notEmpty()
    .withMessage("REASON IS REQUIRED")
    .isLength({ min: 1, max: 500 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 500 CHARACTERS."
    ),

  check("status")
    .trim()
    .notEmpty()
    .withMessage("STATUS IS REQUIRED")
    .isIn(["PENDING", "REVIEWED", "RESOLVED"])
    .withMessage("STATUS MUST BE 'PENDING' OR 'REVIEWED' OR 'RESOLVED'"),
];

export const reportUpdateValidator = [
  check("modelId")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .custom((value) => /^[a-fA-F0-9]{24}$/.test(value))
    .withMessage("Invalid MongoDB ID format"),

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
    .isLength({ min: 1, max: 50 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 50 CHARACTERS."
    ),
];
