import { Router } from "express";
import uploadController from "./upload.controller";
import multerConfig from "./multer.config";
import centerChecker from "../../helper/userChecker";


const router = Router();

// create new
router.post('/profile', centerChecker, multerConfig.profile.single('image'), uploadController.uploadProfile);

// Upload Document
router.post('/document', centerChecker, multerConfig.profile.single('document'), uploadController.uploadDocuement);

// get all
router.get('/profile', centerChecker, uploadController.getAllProfile);

// delete 

router.delete('/all/profile', centerChecker, uploadController.deleteAllProfile)

// delete single

router.delete('/:id', centerChecker, uploadController.deleteSingle)
export default router