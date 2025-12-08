import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { ServerError } from "../manejarErrorCustom.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cloudinary from "../config/cloudinary.config.js";

class AuthService {
    static async register({ username, email, password, avatarFile, avatarUrl }) {

        const user = await UserRepository.getByEmail(email);
        if (user) {
            throw new ServerError(400, 'email ya en uso');
        }

        const password_hashed = await bcrypt.hash(password, 12);
        let finalAvatar = avatarUrl ;

        if (avatarFile) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "avatars" },
                    (err, result) => {
                        if (err) reject(err);
                        else resolve(result);
                    }
                );
                uploadStream.end(avatarFile.buffer);
            });
            finalAvatar = result.secure_url;
        }

        const user_created = await UserRepository.create({
            username,
            email,
            password: password_hashed,
            avatar: finalAvatar ,
            active: true,
            verified_email: false
        });

        const user_id_created = user_created._id;

        const verification_token = jwt.sign(
            {
                email,
                user_id: user_id_created
            },
            ENVIRONMENT.JWT_SECRET
        );

        await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `
            <h1>Verifica tu cuenta de mail</h1>
            <a href="${ENVIRONMENT.BACKEND_URL}/api/auth/verify-email/${verification_token}">Verificar</a>
        `
        });

        return user_created;
    }




    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
            const { user_id } = payload
            if (!user_id) {
                throw new ServerError(400, 'token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if (!user_found) {
                throw new ServerError(404, 'Usuario no encontrado')
            }
            if (user_found.verified_email) {
                throw new ServerError(400, 'usuario ya validado')
            }
            await UserRepository.updateById(user_id, { verified_email: true })

            return
        }
        catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'token invalido')
            }
            throw error
        }
    }

    static async login(email, password) {

        const user_found = await UserRepository.getByEmail(email);
        if (!user_found) {
            throw new ServerError(404, 'usuario o mail no validos');
        }

        if (!user_found.verified_email) {
            throw new ServerError(401, 'usuario con mail no verificado');
        }

        const is_same_password = await bcrypt.compare(password, user_found.password);
        if (!is_same_password) {
            throw new ServerError(401, 'usuario o mail no validos');
        }

        const auth_token = jwt.sign(
            {
                _id: user_found._id,
                username: user_found.username,
                email: user_found.email,
                avatar: user_found.avatar
            },
            ENVIRONMENT.JWT_SECRET
        );

        return {
            auth_token,
            user: {
                _id: user_found._id,
                username: user_found.username,
                email: user_found.email,
                avatar: user_found.avatar
            }
        };
    }

}

export default AuthService