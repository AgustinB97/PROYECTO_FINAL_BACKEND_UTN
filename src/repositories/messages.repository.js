import Message from "../models/Messages.model.js";
import Chat from "../models/Chat.model.js";

class MessageRepository {

    static async createMessage(chatId, senderId, content, type = "text") {

        const message = await Message.create({
            chatId,
            sender: senderId,
            content,
            type,
            seenBy: [senderId]
        });

        await Chat.findByIdAndUpdate(chatId, {
            last_message: message._id
        });

        return message;
    }

    static async getMessagesByChat(chatId) {
        return await Message.find({ chatId })
            .populate("sender", "username email avatar")
            .sort({ createdAt: 1 });
    }

    static async getLastMessage(chatId) {
        return await Message.findOne({ chatId })
            .sort({ createdAt: -1 });
    }

    static async markAsSeen(messageId, userId) {
        return await Message.findByIdAndUpdate(
            messageId,
            { $addToSet: { seenBy: userId } },
            { new: true }
        );
    }
}

export default MessageRepository;
