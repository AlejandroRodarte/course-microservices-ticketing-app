import { Router } from 'express';
import { checkSchema } from 'express-validator';
import { routes } from '@msnr-ticketing-app/common';

import handlers from './handlers';
import routers from './routers';
import schemas from '../../lib/express-validator/schemas';

const router = Router();

router.get('/', routes.middlewares.auth.setUserData, handlers.get);
router.post(
  '/',
  routes.middlewares.auth.setUserData,
  checkSchema(schemas.orders.newOrder),
  routes.middlewares.validation.validateRequest,
  handlers.post
);

router.use('/health', routers.health);
router.use('/:id', routers[':id']);

export default router;
