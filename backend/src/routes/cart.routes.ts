import express from 'express';
import { CartController } from '../controllers/cart/cart.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/role.middleware';

const router = express.Router();

router.get('/', requireAuth, requireRole('customer'), CartController.getCartController);
router.post('/', requireAuth, requireRole('customer'), CartController.addCartController);
router.put('/', requireAuth, requireRole('customer'), CartController.updateCartController);
router.delete('/', requireAuth, requireRole('customer'), CartController.deleteItemController);
router.delete('/clear', requireAuth, requireRole('customer'), CartController.clearCartController);

export default router;