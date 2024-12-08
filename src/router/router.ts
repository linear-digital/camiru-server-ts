import { Router } from "express";
import centerRoute from '../modules/center/center.router'
import studentRoute from '../modules/student/student.router'
import classRoute from '../modules/classroom/class.router'
import uploadRoute from '../modules/upload/upload.router'
import staffRouter from '../modules/staff/staff.router'
import messageRouter from '../modules/message/message.router'
import centerChecker from "../helper/userChecker";
const router = Router();

router.use('/center', centerRoute)
router.use('/student', studentRoute)
router.use('/staff', staffRouter)
router.use('/classroom', centerChecker, classRoute)
router.use('/upload', uploadRoute)
router.use('/message', messageRouter)


export default router