import multer from "multer";

export const uploadAvatar = multer({
    storage: multer.memoryStorage(),
    fileFilter: (_, file, cb) => {
        if (!file.mimetype.startsWith("image/")) {
            return cb(new Error("Solo se permiten imágenes"));
        }
        cb(null, true);
    }
}).single("avatar");


