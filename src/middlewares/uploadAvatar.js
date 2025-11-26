import multer from "multer";

const storage = multer.memoryStorage(); // Guardamos en memoria, no en disco

export const uploadAvatar = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("avatar");
