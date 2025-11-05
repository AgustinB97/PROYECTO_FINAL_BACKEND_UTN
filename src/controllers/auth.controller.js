import ENVIRONMENT from "../config/environment.config.js";
import { ServerError } from "../manejarErrorCustom.js";
import AuthService from "../services/auth.service.js";


export class AuthController {
    static async register(request, response) {
        try {
            const { email, name, password } = request.body
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            const errors = []
            if (!email || !emailRegex.test(email)) {
                errors.push(' email no valido')
            }
            if (typeof name !== 'string' || name.length < 4) {
                errors.push(' name no valido')
            }
            if (typeof password !== 'string' || password.length < 6) {
                errors.push(' password no valida')
            }

            if (errors.length > 0) {
                throw new ServerError(400, errors.join(','))// el metodo .join transforma un array en string, y el (',') separa los elementos en este caso con un ,
            }
            /* 
            Validar el name (que sea string, mayor a 4 caracteres)
            Validar el password (que seas string mayor a 6 caracteres)
            */

            await AuthService.register(email, password, name);


            response.status(201).send({
                ok: true,
                message: 'usuario registrado'

            })
        }
        catch (error) {
            if (error.status) {

                response.send({
                    ok: false,
                    message: error.message,
                    status: error.status
                })
            }
            else {
                console.error(
                    'ERROR AL REGISTRAR', error
                )
                response.send({
                    ok: false,
                    message: 'error interno del servidor',
                    status: 500
                })
            }
        }
    }

    static async verifyEmail(request, response) {
        try {
            const { verification_token } = request.params

            await AuthService.verifyEmail(verification_token)

            response.redirect(
                ENVIRONMENT.URL_FRONTEND + '/login?from=verified_email'
            )
            /*             response.json({
                            ok: true,
                            message: 'usuario verificado correctamente',
                            status: 200
                        }) */

        }
        catch (error) {

            // desp hacer  que si hay algun fallo reenvie el mail de validacion
            if (error.status) {
                /*response.send({
                            ok: false,
                            message: error.message,
                            status: error.status
                        }) */
                response.send(
                    `<h1>${error.message}</h1>`
                )
            }
            else {
                console.error('ERROR AL REGISTRAR', error)

                /*response.send({
                                    ok: false,
                                    message: 'error interno del servidor',
                                    status: 500
                                }) */
                response.send(
                    `<h1>Error en el servidor, intentelo mas tarde </h1>`
                )
            }
        }
    }

    static async login(request, response){
        try{
            const {email, password} = request.body
            const {auth_token}= await AuthService.login(email, password)
            return response.json(
                {
                    ok:true,
                    message:'Usuario logueado con exito',
                    body:{
                        auth_token
                    }
                }
            )
        }
        catch(error){
            if(error.status){
                return response.send({
                ok: false,
                message: error.message,
                status: error.status
            })
        }
        else{
            console.error(
                'error al registrar', error
            )
            return response.send({
                ok:false,
                message:'error interno del servidor',
                status: 500
            })
        }
        }
    }
}

