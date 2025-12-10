import connectToMongoDB from "./config/configMongoDB.config.js";
import express from "express";
import { authRouter } from "./routes/auth.router.js";
import ENVIRONMENT from "./config/environment.config.js";
import cors from 'cors';
import chatRouter from "./routes/chat.routes.js";
import userRouter from "./routes/user.routes.js";
import { createServer } from "http";
import { Server } from "socket.io";
import ChatService from "./services/chat.service.js";


connectToMongoDB();

const app = express();

const httpServer = createServer(app);

export const io = new Server(httpServer, {
    cors: {
        origin: "https://proyecto-final-frontend-utn-iota.vercel.app",
        methods: ["GET", "POST"],
        credentials: true
    },
    transports: ["websocket"]
});

app.use(cors({
    origin: "https://proyecto-final-frontend-utn-iota.vercel.app",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}
));

app.use(express.json());

app.get("/", (req, res) => res.send("API corriendo correctamente"));
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/chat", chatRouter);

app.use("/uploads", express.static("uploads"));

export const notifyUsersChatsUpdated = (chat, io) => {
    chat.members.forEach(member => {
        io.to(member.toString()).emit("chats_updated");
    });
};

io.on("connection", (socket) => {
    console.log("Usuario conectado:", socket.id);

    socket.on("register_user", (userId) => {
        socket.join(userId);
        console.log(`Socket ${socket.id} se unió a la sala del usuario ${userId}`);
    });

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`socket ${socket.id} entró al chat ${chatId}`);
    });


    socket.on("send_message", async (msgData) => {
        console.log("[BACK] send_message recibido:", msgData);
        const { chatId } = msgData;


        const message = await ChatService.createMessage(msgData);

        message = await message.populate("sender", "username avatar");

        const chat = await ChatService.getChatById(chatId);

        io.to(chatId).emit("receive_message", {
            chatId,
            message,
        });

        console.log("[BACK] emit receive_message enviado a sala:", chatId);

        notifyUsersChatsUpdated(chat, io);
    });


    socket.on("delete_message", async ({ messageId }) => {
        try {
            const result = await ChatService.deleteMessage(messageId);

            if (!result.chatId) return;

            const chatId = result.chatId.toString();

            const last_message = await Message.findOne({ chatId })
                .sort({ createdAt: -1 })
                .populate("sender", "_id username avatar");

            io.to(chatId).emit("message_deleted", {
                chatId,
                messageId: result.deleted,
                last_message: last_message || null
            });

            const chat = await ChatService.getChatById(chatId);
            notifyUsersChatsUpdated(chat, io);

        } catch (err) {
            console.error("Error en socket delete_message:", err);
        }
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`🔥 Server + Socket escuchando en puerto ${PORT}`);
});


export default app;
