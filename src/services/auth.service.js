import ENVIRONMENT from "../config/environment.config.js";
import mailTransporter from "../config/mailTransporter.config.js";
import { PORT } from "../main2.js";
import { ServerError } from "../manejarErrorCustom.js";
import UserRepository from "../repositories/user.repository.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'


class AuthService {
    static async register(email, password, name) {

        
        const user = await UserRepository.getByEmail(email);
        if (user) {
            throw new ServerError(400, 'email ya en uso')
        }

        const password_hashed = await bcrypt.hash(password, 12)
        const user_created = await UserRepository.create(name, email, password_hashed)
        const user_id_created = user_created._id

        const verification_token = jwt.sign(
            {
                email:email,
                user_id: user_id_created
            },
            ENVIRONMENT.JWT_SECRET

        )


        await mailTransporter.sendMail({
            from: ENVIRONMENT.GMAIL_USER,
            to: email,
            subject: 'Verifica tu cuenta',
            html: `
            <h1>Verifica tu cuenta de mail</h1>
            <a href="http://localhost:${PORT}/api/auth/verify-email/${verification_token}">Verificar</a>
    `
        })
        return
    }


    static async verifyEmail (verification_token){
        try{
            // nos dice si el token esta firmado con x clave
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET)
            const {user_id} = payload
            if(!user_id){
                throw new ServerError(400, 'token con datos insuficientes')
            }
            const user_found = await UserRepository.getById(user_id)
            if(!user_found){
                throw new ServerError(404, 'Usuario no encontrado')
            }
            if(user_found.verified_email){
                throw new ServerError(400, 'usuario ya validado')
            }
            await UserRepository.updateById(user_id, {verified_email: true})
            
            return
        }
        catch(error){
            //chequeamos si el error es de la verificacion del token
            if(error instanceof jwt.JsonWebTokenError){
                throw new ServerError(400, 'token invalido')
            }
            throw error
        }
    }

    static async login(email, password){
        
        const user_found = await UserRepository.getByEmail(email)
        if(!user_found){
            throw new ServerError(404, 'usuario o mail no validos')
        }
        if(!user_found.verified_email){
            throw new ServerError(401, 'usuario con mail no verificado')
        }

        const is_same_password = await bcrypt.compare(password, user_found.password)
        if(!is_same_password){
            throw new ServerError(401,'usuario o mail no validos')
        }
        //creo un token con datos de sesion (no sensibles)
        const auth_token = jwt.sign(
            {
                name: user_found.name,
                email: user_found.email,
                id: user_found.id
            },
            ENVIRONMENT.JWT_SECRET
        )

        return{
            auth_token: auth_token
        }
    }
}

export default AuthService