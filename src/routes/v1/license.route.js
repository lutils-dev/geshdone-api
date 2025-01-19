import Router from '@koa/router';
import * as licenseController from '../../controllers/v1/license.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = new Router({ prefix: '/api/v1/license' });

router.get('/', authMiddleware, licenseController.getLicense);
router.post('/purchase', authMiddleware, licenseController.purchaseLicense);

export default router;
