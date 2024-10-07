import { Router } from "express";
import centerRoute from '../modules/center/center.router'
import studentRoute from '../modules/student/student.router'
import classRoute from '../modules/classroom/class.router'
import uploadRoute from '../modules/upload/upload.router'
const router = Router();

router.use('/center', centerRoute)
router.use('/student', studentRoute)
router.use('/classroom', classRoute)
router.use('/upload', uploadRoute)


export default router