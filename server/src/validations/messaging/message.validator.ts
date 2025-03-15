import { check } from "express-validator";

export const messageValidator = [
  check("conversationId")
    .trim()
    .notEmpty()
    .withMessage("CONVERSATION ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("senderId")
    .trim()
    .notEmpty()
    .withMessage("CONVERSATION ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("receiverId")
    .trim()
    .notEmpty()
    .withMessage("CONVERSATION ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .withMessage("Invalid MongoDB ID format"),

  check("messageType")
    .trim()
    .notEmpty()
    .withMessage("TITLE IS REQUIRED")
    .isIn(["TEXT", "IMAGE", "VIDEO", "OFFER"]),

  check("text")
    .trim()
    .optional()
    .isLength({ min: 1, max: 500 })
    .withMessage(
      "TEXT MESSAGE IS REQUIRED AND SHOULD BE BETWEEN 1 AND 500 CHARACTERS."
    ),

  check("attachments").optional().isArray(),

  check("readStatus")
    .optional()
    .custom((value) => {
      if (typeof value !== "object")
        throw new Error("readStatus must be an object");
      return true;
    }),

  check("offerDetails")
    .optional()
    .isObject()
    .custom((value) => {
      if (
        !value.itemId ||
        !value.price ||
        !value.status ||
        !value.originalPrice
      ) {
        throw new Error(
          "offerDetails must include itemId, price, status, and originalPrice"
        );
      }
      return true;
    }),
];

export const searchValidator = [
  check("textSearch")
    .trim()
    .notEmpty()
    .bail()
    .isLength({ min: 1, max: 30 })
    .withMessage("TEXT SEARCH MUST BE BETWEEN 1 AND 30 CHARACTERS."),
];
