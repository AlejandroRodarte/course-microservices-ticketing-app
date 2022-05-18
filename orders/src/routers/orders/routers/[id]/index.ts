import { Router } from 'express';
import { routes } from '@msnr-ticketing-app/common';

import handlers from './handlers';

const router = Router({ mergeParams: true });

router.get('/', routes.middlewares.auth.setUserData, handlers.get);
router.delete('/', routes.middlewares.auth.setUserData, handlers.delete);

export default router;
