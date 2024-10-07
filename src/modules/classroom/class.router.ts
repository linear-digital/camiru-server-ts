import { Router } from "express";
import classController from "./class.controller";

const router = Router()

// create new
router.post('/', classController.createNew)

// get all
router.get('/', classController.getAll)

// get all data by canter id

router.get('/center/:id', classController.getClassesByCanter)

// get Single
router.get('/:id', classController.getSingle)

// update
router.put('/:id', classController.updateClass)

// delete
router.delete('/:id', classController.deleteAData)

export default router