import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import userController from '../controllers/userController.js';

const { getStores, submitRating } = userController;

const router = Router();

router.use(auth);
router.use(authorize('user'));

router.get('/stores', getStores);
router.post('/ratings', submitRating);

export default router;