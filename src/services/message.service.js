import MessageRepository from "../repositories/message.repository.js";
import { ServerError } from "../manejarErrorCustom.js";

class MessageService {
    static async sendMessage(senderId, receiverId, content) {
        if (!content || !senderId || !receiverId) {
            throw new ServerError(400, "Datos de mensaje incompletos");
        }

        return await MessageRepository.createMessage(
            senderId,
            receiverId,
            content
        );
    }

    static async getMessages(userId, contactId) {
        return await MessageRepository.getConversation(userId, contactId);
    }

    static async getLastMessage(userId, contactId) {
        return await MessageRepository.getLastMessage(userId, contactId);
    }

}

export default MessageService;
