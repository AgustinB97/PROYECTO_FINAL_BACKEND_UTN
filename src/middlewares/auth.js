import jwt from "jsonwebtoken";
import ENVIRONMENT from "../config/environment.config.js";

export default function auth(req, res, next) {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                ok: false,
                message: "Token no proporcionado"
            });
        }

        const decoded = jwt.verify(token, ENVIRONMENT.JWT_SECRET);

        req.user = {
            _id: decoded._id,
            username: decoded.username,
            email: decoded.email,
            avatar: decoded.avatar
        };

        next();
    } catch (error) {
        return res.status(401).json({
            ok: false,
            message: "Token inválido"
        });
    }
}
