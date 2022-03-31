import { Router } from 'express';
import { checkSchema } from 'express-validator';

import handlers from './handlers';
import usersSchemas from '../../../../lib/express-validator/schemas/users';
import validateRequest from '../../../../middlewares/validation/validate-request';

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
router.post('/sign-out', handlers.signOut.post);
router.get('/current-user', handlers.currentUser.get);

export default router;
