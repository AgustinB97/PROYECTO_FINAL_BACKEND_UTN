import multer from "multer";

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("avatar");
