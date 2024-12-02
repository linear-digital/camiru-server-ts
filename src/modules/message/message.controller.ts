import type { NextFunction, Request, Response } from "express"
import messageService from "./message.service"
import { decrypt, encrypt } from "../../util/security"
import { AccessToken } from 'livekit-server-sdk';
const createMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = decrypt(req.body)
        const result = await messageService.createMessage(data)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const createNewChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const data = decrypt(req.body)

        const result = await messageService.createNewChat(data)

        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getChats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await messageService.getChats()
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const chatByUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await messageService.chatByUser(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getAChat = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await messageService.getAChat(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const getMessages = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await messageService.getMessages(req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const updateMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const body = decrypt(req.body)
        const result = await messageService.updateMessage(req.params.id, body)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const deleteMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await messageService.deleteMessage(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const generateCallToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const room = req.query.room as string
        const username = req.query.username as string
        if (!room || !username) {
            res.status(400).json({ error: 'Missing room or username' });
            return;
        }
        const apiKey = process.env.LIVEKIT_API_KEY;
        const apiSecret = process.env.LIVEKIT_API_SECRET;
        const wsUrl = process.env.LIVEKIT_URL;
        if (!apiKey || !apiSecret || !wsUrl) {
            console.log(apiKey, apiSecret, wsUrl);
            res.status(500).json({ error: 'Server misconfigured' });
            return;
        }
        const at = new AccessToken(apiKey, apiSecret, {
            identity: username
        });
        at.addGrant({
            room,
            roomJoin: true,
            canPublish: true,
            canSubscribe: true,
        });
        const token = await at.toJwt();
        res.json(encrypt({ token }));
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
    getMessages,
    deleteMessage,
    updateMessage,
    generateCallToken
}

export default messageController