import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import storeOwnerController from '../controllers/storeOwnerController.js';

const { getDashboard } = storeOwnerController;
const router = Router();

router.use(auth);
router.use(authorize('store_owner'));

router.get('/dashboard', getDashboard);

export default router;