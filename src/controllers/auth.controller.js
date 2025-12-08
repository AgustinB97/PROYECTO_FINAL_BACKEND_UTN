import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../manejarErrorCustom.js";
import AuthService from "../services/auth.service.js";



export class AuthController {
    static async register(request, response) {
        try {
            const { username, email, password, avatar } = request.body;

            let finalAvatar = null;

            if (request.file) {
                finalAvatar = await new Promise((resolve, reject) => {
                    const upload = cloudinary.uploader.upload_stream(
                        { folder: "avatars/users" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result.secure_url);
                        }
                    );
                    upload.end(request.file.buffer);
                });
            }
            if (!finalAvatar) {
                finalAvatar = ENVIRONMENT.DEFAULT_AVATAR_URL;
            }

            await AuthService.register({
                username,
                email,
                password,
                avatar: finalAvatar,
            });

            response.status(201).send({
                ok: true,
                message: "usuario registrado",
            });

        } catch (error) {
            if (error.status) {
                return response.send({
                    ok: false,
                    message: error.message,
                    status: error.status,
                });
            }
            console.error("ERROR AL REGISTRAR", error);
            return response.send({
                ok: false,
                message: "error interno del servidor",
                status: 500,
            });
        }
    }



    static async verifyEmail(request, response) {
        try {
            const { verification_token } = request.params

            await AuthService.verifyEmail(verification_token)

            response.redirect(
                'https://proyecto-final-frontend-utn-iota.vercel.app' + '/login?from=verified_email'
            )

        }
        catch (error) {

            if (error.status) {
                response.send(
                    `<h1>${error.message}</h1>`
                )
            }
            else {
                console.error('ERROR AL REGISTRAR', error)

                response.send(
                    `<h1>Error en el servidor, intentelo mas tarde </h1>`
                )
            }
        }
    }

    static async login(request, response) {
        try {
            const { email, password } = request.body;

            const { auth_token, user } = await AuthService.login(email, password);

            return response.json({
                ok: true,
                message: 'Usuario logueado con exito',
                body: {
                    auth_token,
                    user
                }
            });

        } catch (error) {
            if (error.status) {
                return response.status(error.status).json({
                    ok: false,
                    message: error.message
                });
            }

            console.error('ERROR AL LOGUEAR', error);

            return response.status(500).json({
                ok: false,
                message: 'error interno del servidor'
            });
        }
    }
}

