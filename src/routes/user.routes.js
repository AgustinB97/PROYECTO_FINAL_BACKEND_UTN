import { Router } from "express";
import User from "../models/User.model.js";
import auth from "../middlewares/auth.js";
import { updateUser, changePassword } from "../controllers/user.controller.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.js";
import { updateAvatar } from "../controllers/user.controller.js";
import validateRequest from "../middlewares/ValidateRequest.middleware.js";
import { changePasswordSchema, updateUserSchema } from "../schemas/auth.schema.js";
const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await User.find({}, "_id username avatar");

        res.json({
            ok: true,
            users: users.map(u => ({
                _id: u._id,
                username: u.username,
                email: u.email,
                avatar: u.avatar || "default.png"
            }))
        });

    } catch (error) {
        next(error);
    }
});
router.put("/update", auth, validateRequest(updateUserSchema), updateUser);
router.put("/change-password", auth, validateRequest(changePasswordSchema), changePassword);
router.put("/update-avatar", auth, uploadAvatar, updateAvatar);

export default router;
