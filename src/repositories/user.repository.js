import User from "../models/User.model.js";

class UserRepository {

    static async create({ username, email, password, avatar }) {
        try {
            const user_created = await User.create({
                username,
                email,
                password,
                avatar,
                verified_email: false,
                active: true
            });
            
            console.log('[SERVER]: usuario creado exitosamente');
            return user_created;

        } catch (error) {
            console.error('[SERVER ERROR]: usuario no creado', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            const users = await User.find();
            return users;
        } catch (error) {
            console.error('[SERVER ERROR]: no se pudo obtener la lista de usuarios', error);
            throw error;
        }
    }

    static async getById(id_user) {
        try {
            const user_found = await User.findById(id_user);
            return user_found;
        } catch (error) {
            console.error('[SERVER ERROR]: no se pudo encontrar al usuario');
            throw error;
        }
    }

    static async getByEmail(email) {
        try {
            const user_found = await User.findOne({ email });
            return user_found;
        } catch (error) {
            console.error('[SERVER ERROR]: no se pudo encontrar al usuario');
            throw error;
        }
    }

    static async deleteById(id_user) {
        try {
            const result = await User.findOneAndDelete({ _id: id_user });
            if (!result) {
                console.log('[SERVER]: no se encontró el usuario');
                return null;
            }

            console.log('[SERVER]: usuario borrado correctamente');
            return result;

        } catch (error) {
            console.error('[SERVER ERROR]: error al intentar borrar usuario', error);
            throw error;
        }
    }

    static async updateById(id_user, update_user) {
        try {
            const result = await User.findByIdAndUpdate(id_user, update_user, { new: true });
            if (!result) {
                console.log('[SERVER]: Usuario no encontrado');
                throw new Error('Usuario no encontrado');
            }

            console.log('[SERVER]: Usuario actualizado correctamente');
            return result;
        } catch (error) {
            console.error('[SERVER ERROR]: Error al actualizar usuario', error);
            throw error;
        }
    }
}

export default UserRepository;
