import { NextFunction, Request, Response } from "express"
import studenService from "./staff.service"
import { decrypt, encrypt } from "../../util/security"


const createNew = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await studenService.createNew(body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await studenService.login(body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

// get all 

const getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await studenService.getAll(req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const getStudenByCenter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await studenService.getStudenByCenter(req.params.id, req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const searchStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await studenService.searchStudent(req.params.id, req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const transferStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const result = await studenService.transferStudent(req.params.id, req.body.class)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}

const getStudentByClass = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await studenService.getStudentByClass(req.query)
        res.send(encrypt(result))
    } catch (error) {
        next(error)
    }
}
const getSingle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await studenService.getSingle(req.params.id)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}

const upadteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = decrypt(req.body)
        const response = await studenService.upadteStudent(req.params.id, body)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await studenService.deleteStudent(req.params.id)
        res.send(encrypt(response))
    } catch (error) {
        next(error)
    }
}
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.center
        if (!user) {
            res.status(401).send({ message: 'Unauthorized' });
        }
        res.send(encrypt(user))
    } catch (error) {
        next(error)
    }
}
const studentController = {
    createNew,
    getAll,
    getStudenByCenter,
    searchStudent,
    transferStudent,
    getStudentByClass,
    getSingle,
    upadteStudent,
    deleteStudent,
    login,
    getCurrentUser
}
export default studentController