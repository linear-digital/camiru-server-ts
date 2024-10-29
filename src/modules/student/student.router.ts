import { Router } from "express";
import studentController from "./student.controller";

const router = Router();

// create new

router.post('/', studentController.createNew);

// get all

router.get('/', studentController.getAll);
router.post('/statistics', studentController.statistics);
router.post('/attandance', studentController.attandance);
router.get('/dashboard', studentController.dbStatistics);


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

// check in
router.put('/student/checkin/:id', studentController.checkIn);
router.put('/student/checkout/:id', studentController.checkOut);
router.put('/student/absent/:id', studentController.absent);

// update student

router.put('/:id', studentController.upadteStudent);

// delete student

router.delete('/:id', studentController.deleteStudent)
export default router