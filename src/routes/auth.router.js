import { request, response, Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { loginSchema } from "../schemas/auth.schema.js";
import { validateRequest } from "../middlewares/ValidateRequest.middleware.js";


//creamos una ruta de express
export const authRouter = Router()


authRouter.get(
    '/test',
    (request,response) => {
        response.send({
            ok: true
        })
    }
);


authRouter.post('/register', AuthController.register);

authRouter.get(
    '/verify-email/:verification_token',
    AuthController.verifyEmail
)
 authRouter.post(
    '/login',
    validateRequest(loginSchema),
    AuthController.login
 );
/* authRouter.post('/verify-email'); */ 