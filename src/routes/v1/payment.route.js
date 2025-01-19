import Router from '@koa/router';
import * as paymentController from '../../controllers/v1/payment.controller.js';
import { authMiddleware } from '../../middleware/auth.middleware.js';

const router = new Router({ prefix: '/api/v1/payment' });

router.post('/create', authMiddleware, paymentController.createPayment);
router.get('/vnpay-return', paymentController.vnpayReturn);
router.get('/vnpay-ipn', paymentController.vnpayIPN);

export default router;
