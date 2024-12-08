import { Router } from "express";
import studentController from "./staff.controller";
import centerChecker from "../../helper/userChecker";

const router = Router();

// create new

router.post('/', studentController.createNew);

router.post('/login', studentController.login);

router.get('/current/me', centerChecker, studentController.getCurrentUser);
// get all

router.get('/', studentController.getAll);


// get student by center

router.get('/center/:id', studentController.getStudenByCenter);

// search student

router.get('/center/search/:id', studentController.searchStudent);

// transfer student

router.patch('/center/transper', studentController.transferStudent);

// get student by class

router.get('/classroom', studentController.getStudentByClass);

// get single

router.get('/:id', studentController.getSingle);

// update student

router.put('/:id', studentController.upadteStudent);

// delete student

router.delete('/:id', studentController.deleteStudent)
export default router