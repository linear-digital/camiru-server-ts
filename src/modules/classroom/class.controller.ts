import { NextFunction, Request, Response } from "express";
import { decrypt, encrypt } from "../../util/security";
import classService from "./classroom.service";


const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await classService.createNew(body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await classService.getAll()
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getClassesByCanter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await classService.getClassesByCanter(req.params.id)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const getSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await classService.getSingle(req.params.id)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const updateClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await classService.updateClass(req.params.id, body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const deleteAData = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await classService.deleteAData(req.params.id)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const classController = {
    createNew,
    getAll,
    getClassesByCanter,
    getSingle,
    updateClass,
    deleteAData
}

export default classController