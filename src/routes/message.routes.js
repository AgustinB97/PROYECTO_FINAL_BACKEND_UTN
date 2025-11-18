import { Router } from "express";
import MessageController from "../controllers/message.controller.js";

const router = Router();

router.post("/message", MessageController.sendMessage);
router.get("/conversation/:userId/:contactId", MessageController.getConversation);
router.get("/last/:userId/:contactId", MessageController.getLastMessage);

export default router;
