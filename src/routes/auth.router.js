import { request, response, Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { uploadAvatar } from "../middlewares/uploadAvatar.js";
import validateRequest from "../middlewares/ValidateRequest.middleware.js";

export const authRouter = Router()


authRouter.get(
    '/test',
    (request, response) => {
        response.send({
            ok: true
        })
    }
);


authRouter.post('/register', uploadAvatar, validateRequest(registerSchema), AuthController.register);

authRouter.get(
    '/verify-email/:verification_token',
    AuthController.verifyEmail
)
authRouter.post(
    '/login',
    validateRequest(loginSchema),
    AuthController.login
);