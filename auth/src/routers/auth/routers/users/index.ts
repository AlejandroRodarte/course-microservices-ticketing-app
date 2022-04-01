import { Router } from 'express';
import { checkSchema } from 'express-validator';

import handlers from './handlers';
import usersSchemas from '../../../../lib/express-validator/schemas/users';
import validateRequest from '../../../../middlewares/validation/validate-request';
import setUserData from '../../../../middlewares/auth/set-user-data';

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
router.post('/sign-out', setUserData, handlers.signOut.post);
router.get('/current-user', setUserData, handlers.currentUser.get);

export default router;
