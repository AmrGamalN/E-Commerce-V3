import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const expressValidator = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array().map((err) => ({
          field: (err as any).path || "unknown",
          message: err.msg,
        })),
      });
      return;
    }
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "An unknown error occurred",
      error: "Unknown error",
    });
    return;
  }
};
