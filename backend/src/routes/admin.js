import { Router } from 'express';
import { auth, authorize } from '../middleware/auth.js';
import adminController from '../controllers/adminController.js';

const {
  getDashboard,
  createUser,
  createStore,
  getUsers,
  getStores
} = adminController;

const router = Router();

router.use(auth);
router.use(authorize('admin'));

router.get('/dashboard', getDashboard);
router.post('/users', createUser);
router.post('/stores', createStore);
router.get('/users', getUsers);
router.get('/stores', getStores);

export default router;