import MessageService from "../services/message.service.js";

class MessageController {

    static async sendMessage(req, res) {
        try {
            const { senderId, receiverId, content } = req.body;

            const message = await MessageService.sendMessage(
                senderId,
                receiverId,
                content
            );

            return res.json({
                ok: true,
                message: "Mensaje guardado",
                data: message
            });

        } catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                message: error.message
            });
        }
    }

    static async getConversation(req, res) {
        try {
            const { userId, contactId } = req.params;

            const messages = await MessageService.getMessages(userId, contactId);

            return res.json({
                ok: true,
                messages
            });

        } catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                message: error.message
            });
        }
    }

    static async getLastMessage(req, res) {
        try {
            const { userId, contactId } = req.params;

            const lastMessage = await MessageService.getLastMessage(userId, contactId);

            return res.json({
                ok: true,
                lastMessage
            });
        } catch (error) {
            res.status(error.status || 500).json({
                ok: false,
                message: error.message
            });
        }
    }

}

export default MessageController;
