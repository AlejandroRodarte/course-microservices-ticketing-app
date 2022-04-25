import { routes } from '@msnr-ticketing-app/common';
import { Router } from 'express';
import { checkSchema } from 'express-validator';

import handlers from './handlers';
import routers from './routers';
import ticketsSchemas from '../../lib/express-validator/schemas/tickets';

const router = Router();

router.get('/', handlers.get);
router.post(
  '/',
  routes.middlewares.auth.setUserData,
  checkSchema(ticketsSchemas.newTicket),
  routes.middlewares.validation.validateRequest,
  handlers.post
);

router.use('/health', routers.health);
router.use('/:id', routers[':id']);

export default router;
