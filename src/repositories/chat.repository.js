import Chat from "../models/Chat.model.js";

class ChatRepository {
    async findByParticipants(participants) {
        return Chat.findOne({
            participants: { $all: participants, $size: 2 }
        });
    }

    async createChat(participants) {
        return Chat.create({ participants, messages: [] });
    }

    async pushMessage(chatId, message) {
        return Chat.findByIdAndUpdate(
            chatId,
            { $push: { messages: message } },
            { new: true }
        );
    }

    async getChatById(id) {
        return Chat.findById(id);
    }
}

export default new ChatRepository();