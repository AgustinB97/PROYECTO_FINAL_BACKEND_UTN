import multer from "multer";

export const uploadAvatar = multer({ storage: multer.memoryStorage() }).single("avatar");

