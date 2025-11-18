import Message from "../models/Message.model.js";

class MessageRepository {
    static async createMessage(senderId, receiverId, content) {
        return await Message.create({
            senderId,
            receiverId,
            content
        });
    }

    static async getConversation(user1, user2) {
        return await Message.find({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        }).sort({ createdAt: 1 });
    }

    static async getLastMessage(user1, user2) {
        return await Message.findOne({
            $or: [
                { senderId: user1, receiverId: user2 },
                { senderId: user2, receiverId: user1 }
            ]
        })
            .sort({ createdAt: -1 }); // último mensaje
    }
}

export default MessageRepository;
