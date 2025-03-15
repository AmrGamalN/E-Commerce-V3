import { check } from "express-validator";

const reportValidatorFactory = (isUpdate = false) =>
  [
    check("modelId")
      .trim()
      .notEmpty()
      .withMessage("ID IS REQUIRED")
      .isMongoId()
      .withMessage("INVALID MONGODB ID")
      .withMessage("Invalid MongoDB ID format")
      .optional(isUpdate),

    check("reason")
      .trim()
      .isString()
      .notEmpty()
      .withMessage("REASON IS REQUIRED")
      .isLength({ min: 1, max: 500 })
      .withMessage(
        "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 500 CHARACTERS."
      )
      .optional(isUpdate),

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
      )
      .optional(isUpdate),

    check("reportType")
      .if(() => !isUpdate)
      .trim()
      .notEmpty()
      .withMessage("REPORT TYPE IS REQUIRED")
      .isIn(["item", "conversation"]),
  ].filter(Boolean);

export const reportFeedBackValidator = [
  check("modelId")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

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
    .isIn(["pending", "reviewed", "resolved"])
    .withMessage("STATUS MUST BE 'pending' OR 'reviewed' OR 'resolved'"),
];

// Update report status
export const updateReportStatusValidator = [
  check("reportId")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),

  check("status")
    .trim()
    .notEmpty()
    .withMessage("STATUS IS REQUIRED")
    .isIn(["pending", "reviewed", "resolved"])
    .withMessage("STATUS MUST BE 'pending' OR 'reviewed' OR 'resolved'"),
];

export const reportAddValidator = reportValidatorFactory(false);
export const reportUpdateValidator = reportValidatorFactory(true);
