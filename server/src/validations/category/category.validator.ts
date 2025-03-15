import { body } from "express-validator";

// prettier-ignore
export const subCategoryValidator = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("NAME IS REQUIRED")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),
  
  body("_id")
    .isString()
    .notEmpty()
    .withMessage("_ID IS REQUIRED"),
    
  body("subcategories.*.brands")
    .isArray()
    .withMessage("BRANDS MUST BE AN ARRAY"),
  
  body("subcategories.*.brands.*.name")
    .isString()
    .notEmpty().withMessage("BRAND NAME IS REQUIRED")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),
  
  body("subcategories.*.brands.*._id")
    .isString()
    .notEmpty()
    .withMessage("BRAND _ID IS REQUIRED"),
    
  body("subcategories.*.types")
    .isArray()
    .withMessage("TYPES MUST BE AN ARRAY")
    .optional(),
  
  body("subcategories.*.types.*.name")
    .isString()
    .notEmpty()
    .withMessage("TYPE NAME IS REQUIRED")
    .optional()
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),
  
  body("subcategories.*.types.*._id")
    .isString()
    .notEmpty()
    .withMessage("TYPE _ID IS REQUIRED")
    .optional(),
];

export const categoryValidator = [
  body("name")
    .isString()
    .notEmpty()
    .withMessage("Category name is required")
    .matches(/^[a-zA-Z]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS"),

  body("subcategories").isArray().withMessage("Subcategories must be an array"),

  body("subcategories.*").custom((value) => {
    if (!value.name || typeof value.name !== "string") {
      throw new Error("Each subcategory must have a valid name");
    }
    if (!value._id || typeof value._id !== "string") {
      throw new Error("Each subcategory must have a valid _id");
    }
    return true;
  }),
];
