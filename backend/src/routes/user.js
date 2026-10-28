import { Router } from 'express';
import * as usersController from '../controllers/user.js';

const router = Router();

router.get('/', usersController.getAll);
router.get('/:id', usersController.getById);
router.post('/', usersController.create);
router.patch('/:id', usersController.update);
router.delete('/:id', usersController.deleteById);

export default router;
