import Router from '@koa/router';
import * as userController from '../../controllers/v1/users.controller.js';

const router = new Router({ prefix: '/api/v1/users' });

router.post('/', userController.createUser);
router.get('/:id', userController.getUser);

export default router;
