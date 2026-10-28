import { Router } from 'express';
import * as usersController from '../controllers/user.js';
import { USER_ROLES } from '../models/constants.js';
import { requireRoles } from '../middlewares/requireRoles.js';

const router = Router();

router.get('/', requireRoles(USER_ROLES.duty, USER_ROLES.director), usersController.getAll);
router.get('/:id', requireRoles(USER_ROLES.duty, USER_ROLES.director), usersController.getById);
router.post('/', requireRoles(USER_ROLES.duty), usersController.create);
router.patch('/:id', requireRoles(USER_ROLES.duty), usersController.update);
router.delete('/:id', requireRoles(USER_ROLES.duty), usersController.deleteById);

export default router;
