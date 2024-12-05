import Center from '../modules/center/center.model';
import { decrypt } from '../util/security';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CenterType } from '../type/user';
import Student from '../modules/student/student.model';
import findUserById, { findUser } from '../util/findUser';

const centerChecker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else {
            token = req.headers.token as string;
        }

        if (!token) {
            res.status(401).send({ message: 'Unauthorized 1' });
        }

        const data: any = await jwt.verify(token, process.env.JWT_SECRET as string);

        if (!data) {
            res.status(401).send({ message: 'Unauthorized 2' });
        }

        const id = decrypt(
            data.id
        );
        const user = await findUser(id);
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        }
        req.center = user; // Attach user data to the request

        next();

    } catch (error: any) {
        console.log(error);
        res.status(401).send({ message: 'Unauthorized 3' });
    }
};

export const studentChecker = async (req: Request, res: Response, next: NextFunction) => {
    try {
        let token;
        if (req.cookies.accessToken) {
            token = req.cookies.accessToken;
        } else {
            token = req.headers.token as string;
        }

        if (!token) {
            res.status(401).send({ message: 'Unauthorized 1' });
        }

        const data: any = await jwt.verify(token, process.env.JWT_SECRET as string);

        if (!data) {
            res.status(401).send({ message: 'Unauthorized 2' });
        }

        const id = decrypt(
            data.id
        );
        const user = await Student.findById(id) as CenterType;
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        }
        req.student = user; // Attach user data to the request

        next();

    } catch (error: any) {
        res.status(401).send({ message: 'Unauthorized 3' });
    }
}

export default centerChecker;