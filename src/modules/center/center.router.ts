import { Router } from 'express';
import centerController from './center.controller';
import centerChecker from '../../helper/userChecker';

const router = Router();

// create new
router.post('/', centerController.createNew);

// login
router.post('/login', centerController.login);

// get current
router.get('/me', centerChecker, centerController.getCurrent);

// get all
router.get('/', centerChecker, centerController.getAll);

// get Single
router.get('/:id', centerChecker, centerController.getSingle);

// search
router.get('/search', centerChecker, centerController.search);

// update
router.put('/:id', centerChecker, centerController.update);

// update password 

router.put('/password/:id', centerChecker, centerController.updatePassword);

// delete
export default router;