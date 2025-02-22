import { body } from "express-validator";

export const addressValidator = [
  body("street").isString().notEmpty().withMessage("STREET IS REQUIRED"),
  body("suite").isString().notEmpty().withMessage("STREET IS REQUIRED"),
  body("houseNumber").isNumeric().notEmpty().withMessage("STREET IS REQUIRED"),
  body("city").isString().notEmpty().withMessage("CITY IS REQUIRED"),
  body("state").isString().notEmpty().withMessage("STATE IS REQUIRED"),
  body("country").isString().notEmpty().withMessage("COUNTRY IS REQUIRED"),
  body("phone").isString().notEmpty().withMessage("PHONE IS REQUIRED"),
  body("type").isString().notEmpty().withMessage("PHONE IS REQUIRED"),
  body("isDefault").isBoolean().notEmpty().withMessage("PHONE IS REQUIRED"),
];
