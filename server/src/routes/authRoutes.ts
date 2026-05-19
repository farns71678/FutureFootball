import Router from 'express';
import { login_post, signup_post } from '../controllers/authController.js';

const router = Router();

router.post('/login', login_post);
router.post('/signup', signup_post);

export default router;