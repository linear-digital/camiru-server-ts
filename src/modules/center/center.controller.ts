import { NextFunction, Request, Response } from "express";
import { decrypt, encrypt } from "../../util/security";
import centerService from "./center.service";

const createNew = async (req: Request, res: Response, next: NextFunction)  => {
    try {
        const body = decrypt(req.body)
        const response = await centerService.createNew(body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await centerService.login(body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const getCurrent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(encrypt(req.center))
    } catch (error) {
        next(error)
    }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 20
        const skip = (page - 1) * limit
        const response = await centerService.getAll(limit, skip)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const getSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await centerService.getSingle(req.params.id)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const search = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const text = req.query.query as string
        const response = await centerService.search(text)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const update = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await centerService.update(req.params.id, body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const updatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await centerService.updatePassword(req.params.id, body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const centerController = {
    createNew,
    login,
    getCurrent,
    getAll,
    getSingle,
    search,
    update,
    updatePassword
}

export default centerController