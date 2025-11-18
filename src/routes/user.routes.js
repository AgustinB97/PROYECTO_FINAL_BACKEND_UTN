import { Router } from "express";
import User from "../models/User.model.js";

const router = Router();

router.get("/", async (req, res, next) => {
    try {
        const users = await User.find({}, "_id name avatar");

        res.json({
            ok: true,
            users: users.map(u => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                avatar: u.avatar || "default.png"
            }))
        });

    } catch (error) {
        next(error);
    }
});

export default router;
