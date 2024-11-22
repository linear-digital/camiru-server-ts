import { NextFunction, Request, Response } from "express"
import messageService from "./message.service"
import { decrypt, encrypt } from "../../util/security"

const createMessage = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = decrypt(req.body)
        const result = await messageService.createMessage(data)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const createNewChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data = decrypt(req.body)
        
        const result = await messageService.createNewChat(data)

        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getChats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.getChats()
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const chatByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.chatByUser(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getAChat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.getAChat(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const getMessages = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await messageService.getMessages(req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const messageController = {
    createMessage,
    createNewChat,
    getChats,
    chatByUser,
    getAChat,
    getMessages
}

export default messageController