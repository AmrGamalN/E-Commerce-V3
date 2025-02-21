import { check, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateMongoId = [
  check("id")
    .trim()
    .notEmpty()
    .withMessage("ID IS REQUIRED")
    .isMongoId()
    .withMessage("INVALID MONGODB ID"),
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

export const validateResult = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
    return;
  }
  next();
};
