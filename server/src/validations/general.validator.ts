import { check } from "express-validator";

export const idValidator = [
  check("id")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .optional(),

  check("itemId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .optional(),

  check("reviewId")
    .trim()
    .notEmpty()
    .withMessage("ITEM ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID")
    .optional(),

  check("userId")
    .trim()
    .notEmpty()
    .withMessage("USER ID IS REQUIRED")
    .custom((value) => {
      if (!/^[a-zA-Z0-9]{28}$/.test(value)) {
        throw new Error("INVALID FIREBASE UID)");
      }
      return true;
    })
    .optional(),
];

export const checkArray = (field: string, errorMessage: string) => {
  return check(field).custom((value) => {
    if (!Array.isArray(value)) {
      return Promise.reject(`${field.toUpperCase()} MUST BE AN ARRAY`);
    }

    // Can be accept number with string
    if (field === "addressIds") {
      const isValid = value.every((item) => /^[A-Za-z0-9-_\s]+$/.test(item));
      return isValid ? true : Promise.reject(errorMessage);
    }

    const isValid = value.every((item) => /^[A-Za-z\s]+$/.test(item));
    return isValid ? true : Promise.reject(errorMessage);
  });
};
