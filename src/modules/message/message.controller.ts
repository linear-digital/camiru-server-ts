import { NextFunction, Request, Response } from "express"
import messageService from "./message.service"
import { encrypt } from "../../util/security"

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.createMessage(req.body)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const createNewChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.createNewChat(req.body.user1, req.body.user2)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const messageController = {
    createMessage,
    createNewChat
}

export default messageController