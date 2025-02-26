import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const validatorBody = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: error.errors.map((issue) => ({
            path: issue.path ? issue.path.join(".") : "unknown",
            message: issue.message,
          })),
        });
        return;
      }
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: "Something went wrong during validation",
          error: error.message,
        });
        return;
      } else {
        res.status(400).json({
          success: false,
          message: "An unknown error occurred",
          error: "Unknown error",
        });
      }
      return;
    }
  };
};

export const validatorParam = (schema: any) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.params;
      if (!params) {
        res.status(400).json({
          success: false,
          message: "No request param provided",
        });
        return;
      }
      schema.parse(params);
      next();
    } catch (error: unknown) {
      if (error instanceof ZodError) {
        res.status(400).json({
          success: false,
          message: "Validation failed",
          error: error.errors.map((issue) => ({
            path: issue.path ? issue.path.join(".") : "unknown",
            message: issue.message,
          })),
        });
        return;
      }
      if (error instanceof Error) {
        res.status(500).json({
          success: false,
          message: "Something went wrong parameter",
          error: error.message,
        });
        return;
      } else {
        res.status(500).json({
          success: false,
          message: "An unknown error occurred",
          error: "Unknown error",
        });
        return;
      }
    }
  };
};
