import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true,
            unique: true
        },
        password:{
            type: String,
            required: true
        }, 
        avatar:{
            type: String,
            required: true
        },
        active:{
            type: Boolean,
            default: true,
            required: true
        },
        verified_email: {
            type: Boolean,
            default:false
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model('User', userSchema);
//el modelo registra el schema para cierta entidad que luego sera guardada en la coleccion
//En este caso quiero guardar usuarios, entonces mi entidad es usuario y registro en mongoose que para la entidad usuario se debera cumplir con X schema
export default User;
