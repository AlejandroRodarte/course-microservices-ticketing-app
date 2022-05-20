import { Router } from 'express';
import { routes } from '@msnr-ticketing-app/common';

import handlers from './handlers';
import middlewares from '../../../../lib/middlewares';

const router = Router({ mergeParams: true });

router.get(
  '/',
  routes.middlewares.auth.setUserData,
  middlewares.auth.isOrderOwnedByUser,
  handlers.get
);
router.delete(
  '/',
  routes.middlewares.auth.setUserData,
  middlewares.auth.isOrderOwnedByUser,
  handlers.delete
);

export default router;
