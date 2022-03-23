import { Router } from 'express';

import handlers from './handlers';

const router = Router();

router.post('/sign-up', handlers.signUp.post);
router.post('/sign-in', handlers.signIn.post);
router.post('/sign-out', handlers.signOut.post);
router.get('/current-user', handlers.currentUser.get);

export default router;
