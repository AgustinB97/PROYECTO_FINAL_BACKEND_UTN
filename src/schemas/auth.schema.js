import Joi from 'joi';


export const registerSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'es'] } })
        .required()
        .messages({
            'string.email': 'Email no válido',
            'string.empty': 'El email es requerido',
            'any.required': 'El email es requerido'
        }),

    username: Joi.string()
        .min(4)
        .max(50)
        .required()
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            'string.min': 'El nombre debe tener al menos 4 caracteres',
            'string.max': 'El nombre no puede tener más de 50 caracteres',
            'string.empty': 'El nombre es requerido',
            'any.required': 'El nombre es requerido',
            'string.pattern.base': 'El nombre solo puede contener letras y espacios'
        }),

    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'string.max': 'La contraseña no puede tener más de 30 caracteres',
            'string.empty': 'La contraseña es requerida',
            'any.required': 'La contraseña es requerida',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        })
});


export const loginSchema = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'es'] } })
        .required()
        .messages({
            'string.email': 'Email no válido',
            'string.empty': 'El email es requerido',
            'any.required': 'El email es requerido'
        }),


    password: Joi.string()
        .min(6)
        .max(30)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
            'string.min': 'La contraseña debe tener al menos 6 caracteres',
            'string.max': 'La contraseña no puede tener más de 30 caracteres',
            'string.empty': 'La contraseña es requerida',
            'any.required': 'La contraseña es requerida',
            'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        })
});


export const changePasswordSchema = Joi.object({
    currentPassword: Joi.string()
        .min(6)
        .max(30)
        .required()
        .messages({
            "string.empty": "La contraseña actual es requerida",
            "string.min": "La contraseña actual debe tener al menos 6 caracteres"
        }),

    newPassword: Joi.string()
        .min(6)
        .max(30)
        .required()
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .messages({
            "string.empty": "La nueva contraseña es requerida",
            "string.min": "La nueva contraseña debe tener al menos 6 caracteres",
            "string.pattern.base": "La contraseña debe contener mayúscula, minúscula y un número"
        })
});


export const updateUserSchema = Joi.object({
    username: Joi.string()
        .min(4)
        .max(50)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El nombre es requerido",
            "string.min": "El nombre debe tener mínimo 4 caracteres",
            "string.pattern.base": "El nombre solo puede contener letras y espacios"
        }),

    avatar: Joi.string()
        .uri()
        .allow(null, "")
        .messages({
            "string.uri": "El avatar debe ser una URL válida"
        })
});