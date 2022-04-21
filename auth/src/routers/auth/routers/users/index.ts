import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { routes } from '@msnr-ticketing-app/common';

import handlers from './handlers';
import usersSchemas from '../../../../lib/express-validator/schemas/users';

const router = Router();

router.post(
  '/sign-up',
  checkSchema(usersSchemas.signUp),
  routes.middlewares.validation.validateRequest,
  handlers.signUp.post
);
router.post(
  '/sign-in',
  checkSchema(usersSchemas.signIn),
  routes.middlewares.validation.validateRequest,
  handlers.signIn.post
);
router.post(
  '/sign-out',
  routes.middlewares.auth.setUserData,
  handlers.signOut.post
);
router.get(
  '/current-user',
  routes.middlewares.auth.setUserData,
  handlers.currentUser.get
);

export default router;
