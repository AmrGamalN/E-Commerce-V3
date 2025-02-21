import express, { Request, Response, NextFunction } from "express";

export const parser = (req: Request, res: Response, next: NextFunction) => {
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
  console.log(req.body);
  next();
};
