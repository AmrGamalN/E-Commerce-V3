import { Request, Response, NextFunction } from "express";
export const extractUserImages = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files: string[] = req.files
    ? Object.values(req.files).flatMap((fileArray) =>
        (fileArray as Express.Multer.File[]).map((file) => file.path)
      )
    : [];
  req.body.coverImage = files[1];
  req.body.profileImage = files[0];
  next();
};

export const extractItemImages = (req: Request, res: Response, next: NextFunction) => {
  const files: string[] = req.files
    ? Object.values(req.files).flatMap((fileArray) =>
        (fileArray as Express.Multer.File[]).map((file) => file.path)
      )
    : [];
  const rotateDegrees = req.body.rotateDeg.split(",");
  req.body.itemImages = files.map((file, index) => ({
    imageUrl: file,
    rotateDeg: Number(rotateDegrees[index]) || 0,
  }));
  next();
};

