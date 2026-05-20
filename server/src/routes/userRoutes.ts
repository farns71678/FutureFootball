import Router from 'express';
import {
  userGroupsOwned_get,
  userMemberships_get,
  userPicks_get,
  userPicks_post,
} from '../controllers/userController.js';
import { checkUser, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/picks', checkUser, requireAuth, userPicks_get);
router.get('/memberships', checkUser, requireAuth, userMemberships_get);
router.get('/groupsOwned', checkUser, requireAuth, userGroupsOwned_get);

router.post('/picks', checkUser, requireAuth, userPicks_post);

export default router;
