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
        origin: [ENVIRONMENT.URL_FRONTEND, "https://proyecto-final-frontend-utn-iota.vercel.app/",
            "https://proyecto-final-frontend-utn.vercel.app"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.use(cors({
    origin: [ENVIRONMENT.URL_FRONTEND, "https://proyecto-final-frontend-utn-iota.vercel.app/",
        "https://proyecto-final-frontend-utn.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true
}));

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
        const { chatId } = msgData;


        const message = await ChatService.createMessage(msgData);


        const chat = await ChatService.getChatById(chatId);

        io.to(chatId).emit("receive_message", {
            chatId,
            message,
        });

        notifyUsersChatsUpdated(chat, io);
    });


    socket.on("delete_message", async ({ messageId }) => {
        try {
            const result = await ChatService.deleteMessage(messageId);

            if (result.chatId) {

                const chat = await ChatService.getChatById(result.chatId);


                io.to(result.chatId).emit("message_deleted", {
                    messageId: result.deleted
                });

                notifyUsersChatsUpdated(chat, io);
            }

        } catch (err) {
            console.error("Error en socket delete_message:", err.message);
            socket.emit("error_delete_message", { message: err.message });
        }
    });

    socket.on("disconnect", () => {
        console.log("Usuario desconectado:", socket.id);
    });
});

if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT;
    httpServer.listen(PORT, () =>
        console.log(`🔥 Server + Socket corriendo en puerto ${PORT}`)
    );
}

export default app;
