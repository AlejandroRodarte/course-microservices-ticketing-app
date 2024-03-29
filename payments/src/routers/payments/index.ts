import { routes } from '@msnr-ticketing-app/common';
import { Router } from 'express';
import { checkSchema } from 'express-validator';

import handlers from './handlers';
import routers from './routers';

import chargesSchemas from '../../lib/express-validator/schemas/charges';
import middlewares from '../../lib/middlewares';

const router = Router();

router.post(
  '/',
  routes.middlewares.auth.setUserData,
  checkSchema(chargesSchemas.newCharge),
  routes.middlewares.validation.validateRequest,
  middlewares.attach.orderId.newCharge,
  middlewares.auth.isOrderOwnedByUser,
  handlers.post
);
router.use('/health', routers.health);

export default router;
