import { routes } from '@msnr-ticketing-app/common';
import { Router } from 'express';
import { checkSchema } from 'express-validator';

import middlewares from '../../../../lib/middlewares';
import handlers from './handlers';
import ticketsSchemas from '../../../../lib/express-validator/schemas/tickets';

const router = Router({ mergeParams: true });

router.get('/', handlers.get);
router.put(
  '/',
  routes.middlewares.auth.setUserData,
  checkSchema(ticketsSchemas.updateTicket),
  routes.middlewares.validation.validateRequest,
  middlewares.auth.isTicketOwnedByUser,
  handlers.put
);

export default router;
