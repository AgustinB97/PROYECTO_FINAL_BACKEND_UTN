import chatRepository from "../repositories/chat.repository.js";
import { addMessageSchema } from "../schemas/message.schema.js";
import { CustomError } from "../manejarErrorCustom.js";

class ChatService {
    async addMessage(data) {
        const { error } = addMessageSchema.validate(data);
        if (error) {
            throw new CustomError(error.details[0].message, 400);
        }

        const { participants, text, senderId } = data;

        // buscar o crear el chat
        let chat = await chatRepository.findByParticipants(participants);
        if (!chat) {
            chat = await chatRepository.createChat(participants);
        }

        const now = new Date();
        const hour = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

        const message = {
            senderId,
            text,
            hour,
            createdAt: now
        };

        return chatRepository.pushMessage(chat._id, message);
    }


    async getChat(userId, contactId) {
        const participants = [userId, contactId];
        const chat = await chatRepository.findByParticipants(participants);
        return chat;
    }
}

export default new ChatService();
