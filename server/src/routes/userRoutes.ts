import Router from 'express';
import { userGroupsOwned_get, userMemberships_get, userPicks_get } from '../controllers/userController.js';
import { checkUser, requireAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/picks', checkUser, requireAuth, userPicks_get);
router.get('/memberships', checkUser, requireAuth, userMemberships_get);
router.get('/groupsOwned', checkUser, requireAuth, userGroupsOwned_get);

export default router;
