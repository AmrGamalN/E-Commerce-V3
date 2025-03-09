import multer, { MulterError } from "multer";
import { NextFunction, Request, Response } from "express";
import path from "path";

const uploadDir = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname +
        "-" +
        Date.now() +
        "." +
        file.originalname.split(".")[file.originalname.split(".").length - 1]
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) {
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
      callback(null, true);
    } else {
      callback(
        new Error(
          "Only .png, .jpg and .jpeg format allowed!"
        ) as unknown as null,
        false
      );
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, //10MB
  },
});

const uploadFile =
  (uploadMiddleware: any) =>
  (req: Request, res: Response, next: NextFunction) => {
    uploadMiddleware(req, res, (err: any) => {
      if (err instanceof MulterError) {
        return res.status(400).json({
          success: false,
          message: `File upload error: ${err.message}`,
        });
      } else if (err) {
        return res.status(500).json({
          success: false,
          message: "Unknown file upload error",
          error: err.message,
        });
      } else {
        next();
      }
    });
  };

export const userUploadImage = uploadFile(
  upload.fields([
    { maxCount: 1, name: "profileImage" },
    { maxCount: 1, name: "coverImage" },
  ])
);

export const itemUploadImage = uploadFile(
  upload.fields([{ maxCount: 5, name: "itemImages" }])
);
