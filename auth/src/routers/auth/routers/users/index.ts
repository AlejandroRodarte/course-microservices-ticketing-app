import { Router } from 'express';
import { checkSchema } from 'express-validator';

import handlers from './handlers';
import usersSchemas from '../../../../lib/express-validator/schemas/users';
import validateRequest from '../../../../middlewares/validation/validate-request';
import verifyToken from '../../../../middlewares/auth/verify-token';

const router = Router();

router.post(
  '/sign-up',
  checkSchema(usersSchemas.signUp),
  validateRequest,
  handlers.signUp.post
);
router.post(
  '/sign-in',
  checkSchema(usersSchemas.signIn),
  validateRequest,
  handlers.signIn.post
);
router.post('/sign-out', verifyToken, handlers.signOut.post);
router.get('/current-user', verifyToken, handlers.currentUser.get);

export default router;
