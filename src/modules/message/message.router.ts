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
router.get('/call/token', messageController.generateCallToken)
// update message
router.put('/:id', messageController.updateMessage)
// delete message
router.delete('/:id', messageController.deleteMessage)



export default router