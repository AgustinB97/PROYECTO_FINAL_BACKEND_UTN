import chatService from "../services/chat.service.js";
import { CustomError } from "../manejarErrorCustom.js";

class ChatController {
    async addMessage(req, res, next) {
        try {
            const chat = await chatService.addMessage(req.body);
            return res.status(201).json({ success: true, chat });
        } catch (err) {
            next(err);
        }
    }

    async getChat(req, res, next) {
        try {
            const { userId, contactId } = req.params;

            if (!userId || !contactId) {
                throw new CustomError("Faltan parámetros", 400);
            }

            const chat = await chatService.getChat(userId, contactId);

            if (!chat) {
                return res.status(404).json({ success: false, message: "Chat no encontrado" });
            }

            return res.json({ success: true, chat });
        } catch (err) {
            next(err);
        }
    }
}

export default new ChatController();
