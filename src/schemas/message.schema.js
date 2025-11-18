import Joi from "joi";

export const addMessageSchema = Joi.object({
    participants: Joi.array()
        .items(Joi.string().required())
        .length(2)
        .required(),
    text: Joi.string().min(1).required(),
    senderId: Joi.string().optional(),
});
