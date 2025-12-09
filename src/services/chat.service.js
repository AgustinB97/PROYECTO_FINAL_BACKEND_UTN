import Chat from "../models/Chat.model.js";
import Message from "../models/Messages.model.js";
import User from "../models/User.model.js";
import { CustomError } from "../manejarErrorCustom.js";
import ENVIRONMENT from "../config/environment.config.js";

class ChatService {

  static async createOrGetPrivateChat(userAId, userBId) {
    if (!userAId || !userBId)
      throw new CustomError("Faltan userIds", 400);

    if (String(userAId) === String(userBId))
      throw new CustomError("No puedes crear un chat contigo mismo", 400);

    let chat = await Chat.findOne({
      isGroup: false,
      members: { $all: [userAId, userBId], $size: 2 }
    })
      .populate("members", "username avatar")
      .populate({
        path: "last_message",
        populate: { path: "sender", select: "username avatar" }
      });

    if (!chat) {
      chat = await Chat.create({
        isGroup: false,
        members: [userAId, userBId]
      });

      chat = await Chat.findById(chat._id).populate("members", "username avatar");
    }

    return chat;
  }

  static async createGroup({ name, ownerId, participants = [], avatar = null }) {
    if (!name || !ownerId)
      throw new CustomError("Faltan datos para crear el grupo", 400);

    const owner = await User.findById(ownerId);
    if (!owner) throw new CustomError("Owner no existe", 404);

    const unique = [...new Set([ownerId, ...participants])];

    const finalAvatar = avatar || ENVIRONMENT.DEFAULT_AVATAR_URL;

    const group = await Chat.create({
      name,
      isGroup: true,
      admins: [ownerId],
      members: unique,
      avatar: finalAvatar
    });

    return Chat.findById(group._id)
      .populate("members", "username avatar")
      .populate({
        path: "last_message",
        populate: { path: "sender", select: "username avatar" }
      });
  }

  static async getChatsByUser(userId) {
    if (!userId) throw new CustomError("Falta userId", 400);

    return Chat.find({ members: userId })
      .populate("members", "username avatar")
      .populate({
        path: "last_message",
        populate: { path: "sender", select: "username avatar" }
      })
      .sort({ updatedAt: -1 });
  }

  static async getChatById(chatId) {
    if (!chatId) throw new CustomError("Falta chatId", 400);

    return Chat.findById(chatId)
      .populate("members", "username avatar")
      .populate({
        path: "last_message",
        populate: { path: "sender", select: "username avatar" }
      });
  }

  static async addUserToGroup(chatId, userId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new CustomError("Chat no encontrado", 404);
    if (!chat.isGroup) throw new CustomError("No es un grupo", 400);

    if (chat.members.includes(userId))
      throw new CustomError("Usuario ya está en el grupo", 400);

    chat.members.push(userId);
    await chat.save();

    return Chat.findById(chatId).populate("members", "username avatar");
  }

  static async removeUserFromGroup(chatId, userId) {
    const chat = await Chat.findById(chatId);
    if (!chat) throw new CustomError("Chat no encontrado", 404);
    if (!chat.isGroup) throw new CustomError("No es un grupo", 400);

    chat.members = chat.members.filter(m => String(m) !== String(userId));
    await chat.save();

    return Chat.findById(chatId).populate("members", "username avatar");
  }

  static async createMessage({ senderId, chatId, content, type = "text" }) {
    if (!senderId || !chatId || !content)
      throw new CustomError("Faltan datos para enviar mensaje", 400);

    const chat = await Chat.findById(chatId);
    if (!chat) throw new CustomError("Chat no encontrado", 404);

    if (!chat.members.some(m => String(m) === String(senderId)))
      throw new CustomError("No eres miembro de este chat", 403);

    const message = await Message.create({
      chatId,
      sender: senderId,
      content,
      type
    });

    return message;
  }

  static async getMessages(chatId, limit = 100, skip = 0) {
    if (!chatId) throw new CustomError("Falta chatId", 400);

    return Message.find({ chatId })
      .populate("sender", "username avatar")
      .sort({ createdAt: 1 })
      .skip(Number(skip))
      .limit(Number(limit));
  }

  static async getLastMessage(chatId) {
    if (!chatId) throw new CustomError("Falta chatId", 400);

    const chat = await Chat.findById(chatId)
      .populate({
        path: "last_message",
        populate: { path: "sender", select: "username avatar" }
      });

    return chat?.last_message || null;
  }

  static async deleteMessage(messageId) {
    const msg = await Message.findById(messageId);

    if (!msg) {
      return { ok: false, chatId: null, deleted: null };
    }

    const chatId = msg.chatId;

    await Message.findByIdAndDelete(messageId);

    const last = await Message.findOne({ chatId }).sort({ createdAt: -1 });

    await Chat.findByIdAndUpdate(chatId, {
      last_message: last ? last._id : null
    });

    return { ok: true, chatId, deleted: messageId };
  }
}


export default ChatService;
