import User from "../models/User.model.js";

export const getUsers = async (req, res) => {
    try {
        const users = await User.find();

        return res.json({
            ok: true,
            users: users.map(u => ({
                _id: u._id,
                name: u.name,
                email: u.email,
                avatar: u.avatar || "default.png"
            }))
        });

    } catch (error) {
        res.status(500).json({ ok: false, message: error.message });
    }
};
