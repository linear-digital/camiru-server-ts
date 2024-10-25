import { Router } from "express";
import messageController from "./message.controller";

const router = Router()

// create new
router.post('/', messageController.createMessage);

// create a chat
router.post('/chat', messageController.createNewChat)

export default router