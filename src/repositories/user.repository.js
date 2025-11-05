import User from "../models/User.model.js"

class UserRepository {

    static async create(name, email, password) {
        try {
            return await User.insertOne({
                name: name,
                email: email,
                password: password
            })
            console.log('[SERVER]: usuario creado exitosamente')
        }
        catch (error) {
            console.log('[SERVER ERROR]: usuario no creado', error)
        }
    }

    static async getAll() {
        try {
            const users = await User.find()
            console.log(users)
            return users
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener la lista de usuarios', error)
        }
    }
    static async getById(id_user) {
        try {
            const user_found = await User.findById(id_user)
            console.log(user_found)
            return user_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo encontrar al usuario')
        }

    }
    static async getByEmail(email) {
        try {
            const user_found = await User.findOne({ email })
            console.log(user_found)
            return user_found
        }
        catch (error) {
            console.error('[SERVER ERROR]: no se pudo encontrar al usuario')
        }

    }
    static async deleteById(id_user) {
        try {
            const result = await User.findOneAndDelete({ _id: id_user })
            if (!result) {
                console.log('[SERVER]: no se encontro el usuario');
                return null;
            }
            else {
                console.log('[SERVER]: usuario borrado correctamente', result);
                return result;
            }
        }
        catch (error) {
            console.error('[SERVER ERROR]: error al intentar borrar usuario', error);
            throw error
        }
    }
    static async updateById(id_user, update_user) {
        try {
            const result = await User.findByIdAndUpdate(id_user, update_user, { new: true });// el new: true devuelve el objeto ya modificado
                                                                                             // (por defecto el findAndUpdate retorna el objeto sin modificar)
            if (!result) {
                console.log('[SERVER]: Usuario no encontrado');
                throw new Error('Usuario no encontrado');
            }

            console.log('[SERVER]: Usuario actualizado correctamente', result);
            return result;
        } catch (error) {
            console.error('[SERVER ERROR]: Error al actualizar usuario', error);
            throw error;
        }
    }

}

export default UserRepository