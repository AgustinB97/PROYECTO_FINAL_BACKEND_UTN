import { Router } from "express";
import ChatController from "../controllers/chat.controller.js";

const router = Router();

router.post("/private", ChatController.createOrGetPrivate);

router.post("/group/create", ChatController.createGroup);

router.get("/user/:userId", ChatController.getUserChats);

router.post("/message", ChatController.sendMessage);
router.get("/:chatId/messages", ChatController.getMessages);
router.delete("/message/:id", ChatController.deleteMessage);

router.get("/:chatId", ChatController.getChatById);

router.post("/:chatId/add-user", ChatController.addUser);
router.post("/:chatId/remove-user", ChatController.removeUser);

router.get("/:chatId/last", ChatController.getLastMessage);

export default router;
