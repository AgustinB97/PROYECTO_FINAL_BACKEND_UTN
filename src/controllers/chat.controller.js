import ChatService from "../services/chat.service.js";
import Chat from "../models/Chat.model.js";
import Message from "../models/Messages.model.js";
import { io, notifyUsersChatsUpdated } from "../main2.js";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.config.js";
import ENVIRONMENT from "../config/environment.config.js";

class ChatController {

    async createOrGetPrivate(req, res) {
        try {
            const { userAId, userBId } = req.body;
            const chat = await ChatService.createOrGetPrivateChat(userAId, userBId);
            notifyUsersChatsUpdated(chat, io);
            io.to(userAId).emit("new_chat", chat);
            io.to(userBId).emit("new_chat", chat);

            return res.status(200).json({ ok: true, chat });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }


    async createGroup(req, res) {
        try {
            const { name, ownerId, participants } = req.body;
            const parsedParticipants = JSON.parse(participants);
            let avatarUrl = null;

            if (req.file) {
                avatarUrl = await new Promise((resolve, reject) => {
                    const upload = cloudinary.uploader.upload_stream(
                        { folder: "avatars/groups" },
                        (err, result) => {
                            if (err) reject(err);
                            else resolve(result.secure_url);
                        }
                    );
                    streamifier.createReadStream(req.file.buffer).pipe(upload);
                });
            }

            if (!avatarUrl) {
                avatarUrl = ENVIRONMENT.DEFAULT_AVATAR_URL;
            }

            const group = await ChatService.createGroup({
                name,
                ownerId,
                participants: parsedParticipants,
                avatar: avatarUrl
            });

            return res.status(201).json({ ok: true, group });

        } catch (error) {
            console.error("ERROR CREANDO GRUPO:", error);
            return res.status(500).json({ ok: false, message: error.message });
        }
    };


    async getUserChats(req, res) {
        try {
            const { userId } = req.params;
            const chats = await ChatService.getChatsByUser(userId);
            return res.json({ ok: true, chats });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }

    async getChatById(req, res) {
        try {
            const { chatId } = req.params;
            const chat = await Chat.findById(chatId)
                .populate("members", "_id username avatar")
                .populate("admins", "_id username avatar")
                .populate("last_message");

            if (!chat) {
                return res.status(404).json({
                    ok: false,
                    message: "Chat no encontrado"
                });
            }

            const messages = await Message.find({ chatId })
                .populate("sender", "_id username avatar")
                .sort({ createdAt: 1 });

            return res.json({
                ok: true,
                chat,
                messages
            });

        } catch (err) {
            console.error("ERROR getChatById:", err);
            return res.status(500).json({
                ok: false,
                message: "Error interno"
            });
        }
    }


    async addUser(req, res) {
        try {
            const { chatId } = req.params;
            const { userId } = req.body;
            const updated = await ChatService.addUserToGroup(chatId, userId);
            return res.json({ ok: true, group: updated });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }


    async removeUser(req, res) {
        try {
            const { chatId } = req.params;
            const { userId } = req.body;
            const updated = await ChatService.removeUserFromGroup(chatId, userId);
            return res.json({ ok: true, group: updated });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }


    async sendMessage(req, res) {
        try {
            const { senderId, chatId, content, type } = req.body;

            if (!senderId || !chatId || !content) {
                return res.status(400).json({
                    ok: false,
                    message: "Faltan datos obligatorios"
                });
            }

            const newMessage = await Message.create({
                sender: senderId,
                chatId,
                type: type || "text",
                content
            });

            const chat = await Chat.findById(chatId).populate("members");

            const populatedMsg = await Message.findById(newMessage._id)
                .populate("sender", "_id username avatar")
                .populate("chatId", "_id name members avatar");

            await Chat.findByIdAndUpdate(chatId, {
                last_message: newMessage._id
            });

            notifyUsersChatsUpdated(chat, io);
            io.to(chatId).emit("receive_message", populatedMsg);

            return res.status(201).json({
                ok: true,
                message: populatedMsg
            });

        } catch (error) {
            console.error("ERROR sendMessage:", error);
            return res.status(500).json({
                ok: false,
                message: "Error enviando mensaje"
            });
        }
    }

    async getMessages(req, res) {
        try {
            const { chatId } = req.params;
            const { limit = 100, skip = 0 } = req.query;
            const messages = await ChatService.getMessages(chatId, limit, skip);
            return res.json({ ok: true, messages });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }

    async getLastMessage(req, res) {
        try {
            const { chatId } = req.params;
            const last = await ChatService.getLastMessage(chatId);
            return res.json({ ok: true, lastMessage: last });
        } catch (error) {
            return res.status(error.status || 500).json({ ok: false, message: error.message });
        }
    }

    async deleteMessage(req, res) {
        try {
            const messageId = req.params.id;

            const msg = await Message.findById(messageId);

            if (!msg) return res.status(404).json({ ok: false, message: "Mensaje no encontrado" });

            const chatId = msg.chat.toString();
            
            await msg.deleteOne();

            const lastMsg = await Message.findOne({ chat: chatId })
                .sort({ createdAt: -1 })
                .populate("sender", "_id username avatar")
                .populate("chatId", "_id name members avatar");

            const chat = await Chat.findByIdAndUpdate(
                chatId,
                { last_message: lastMsg ? lastMsg._id : null },
                { new: true }
            );

            notifyUsersChatsUpdated(chat, io);

            io.to(chatId).emit("message_deleted", {
                messageId: msg._id,
                chatId,
                last_message: lastMsg || null
            });

            return res.json({ ok: true, messageId: msg._id });

        } catch (err) {
            console.error("Error borrando mensaje:", err);
            return res.status(500).json({ ok: false, message: "Error al borrar mensaje" });
        }
    }



}

export default new ChatController();
