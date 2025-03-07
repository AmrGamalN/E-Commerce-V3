import express, { Request, Response, NextFunction } from "express";

export const userRegisterParser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files: string[] = req.files
    ? Object.values(req.files).flatMap((fileArray) =>
        (fileArray as Express.Multer.File[]).map((file) => file.path)
      )
    : [];

  req.body.paymentOptions = req.body.paymentOptions.split(",");
  req.body.addressIds = req.body.addressIds.split(",");
  req.body.allowedToShow = req.body.allowedToShow.split(",");
  req.body.business = req.body.business === "true";
  req.body.personal = req.body.personal === "true";
  req.body.coverImage = files[1];
  req.body.profileImage = files[0];

  next();
};

export const userUpdateParser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files: string[] = req.files
    ? Object.values(req.files).flatMap((fileArray) =>
        (fileArray as Express.Multer.File[]).map((file) => file.path)
      )
    : [];
  if (req.body.paymentOptions !== undefined) {
    req.body.paymentOptions = req.body.paymentOptions.split(",");
  }

  if (req.body.addressIds !== undefined) {
    req.body.addressIds = req.body.addressIds.split(",");
  }

  if (req.body.allowedToShow !== undefined) {
    req.body.allowedToShow = req.body.allowedToShow.split(",");
  }
  req.body.coverImage = files[1];
  req.body.profileImage = files[0];
  next();
};

export const itemParser = (req: Request, res: Response, next: NextFunction) => {
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
  req.body.communications = req.body.communications.split(",");
  req.body.paymentOptions = req.body.paymentOptions.split(",");
  req.body.price = Number(req.body.price);
  req.body.allowQuantity = Number(req.body.allowQuantity);
  req.body.discount = Number(req.body.discount);
  req.body.avgRating = Number(req.body.avgRating);
  req.body.isSavedForLater = req.body.isSavedForLater === "true";
  req.body.allowNegotiate = req.body.isSavedForLater === "true";
  next();
};

