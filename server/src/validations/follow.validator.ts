import { check} from "express-validator";

export const followValidator = [
  check("followingId")
    .trim()
    .custom((value) => {
      if (!/^[a-zA-Z0-9]{28}$/.test(value)) {
        throw new Error("INVALID FOLLOWING Id)");
      }
      return true;
    })
    .optional(),

  check("typeFollow")
    .trim()
    .isString()
    .isIn(["follower", "following"])
    .withMessage("TYPE MUST BE 'follower','following'")
    .optional(),

  check("name")
    .trim()
    .isString()
    .withMessage("NAME IS REQUIRED")
    .isLength({ min: 1, max: 30 })
    .withMessage("NAME MUST BE BETWEEN 1 AND 30 CHARACTERS.")
    .matches(/^[a-zA-Z ]+$/)
    .withMessage("MUST CONTAIN ONLY LETTERS")
    .optional(),
];
