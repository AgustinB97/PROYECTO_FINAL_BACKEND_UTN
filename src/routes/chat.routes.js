import { Router } from "express";
import chatController from "../controllers/chat.controller.js";

const router = Router();

router.get("/:userId/:contactId", chatController.getChat);
router.post("/message", chatController.addMessage);

export default router;
