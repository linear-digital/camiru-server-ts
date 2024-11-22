import { Router } from "express";
import messageController from "./message.controller";

const router = Router()

// create new
router.post('/', messageController.createMessage);
router.get('/', messageController.getMessages)
// create a chat
router.post('/chat', messageController.createNewChat)
router.get('/chat', messageController.getChats)
router.get('/chat/user/:id', messageController.chatByUser)
router.get('/chat/:id', messageController.getAChat)
router.delete('/msg/:id', messageController.deleteMessage)



export default router