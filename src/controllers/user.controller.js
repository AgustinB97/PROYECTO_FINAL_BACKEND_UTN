import User from "../models/User.model.js";
import bcrypt from "bcrypt";
import { ServerError } from "../manejarErrorCustom.js";
import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

export const updateUser = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const { username, avatar } = req.body;

        const updated = await User.findByIdAndUpdate(
            userId,
            { username, avatar },
            { new: true }
        ).select("_id username email avatar");

        res.json({
            ok: true,
            user: updated
        });

    } catch (error) {
        next(error);
    }
};


export const changePassword = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            throw new ServerError(404, "Usuario no encontrado");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                ok: false,
                message: "La contraseña actual es incorrecta"
            });
        }

        const hashed = await bcrypt.hash(newPassword, 12);

        user.password = hashed;
        await user.save();

        res.json({
            ok: true,
            message: "Contraseña actualizada correctamente"
        });

    } catch (error) {
        next(error);
    }
};

export const updateAvatar = async (req, res, next) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            return res.status(400).json({ ok: false, message: "No se envió ningún archivo" });
        }

        // Subimos el buffer a Cloudinary
        const result = await cloudinary.v2.uploader.upload_stream(
            { folder: "avatars" },
            async (error, result) => {
                if (error) return next(error);

                const updatedUser = await User.findByIdAndUpdate(
                    userId,
                    { avatar: result.secure_url },
                    { new: true }
                ).select("_id username email avatar");

                res.json({ ok: true, avatar: updatedUser.avatar, user: updatedUser });
            }
        );

        result.end(req.file.buffer);

    } catch (error) {
        next(error);
    }
};
