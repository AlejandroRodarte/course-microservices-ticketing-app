import { Router } from 'express';
import { routes } from '@msnr-ticketing-app/common';

import handlers from './handlers';
import routers from './routers';

const router = Router();

router.get('/', routes.middlewares.auth.setUserData, handlers.get);
router.post('/', routes.middlewares.auth.setUserData, handlers.post);

router.use('/health', routers.health);
router.use('/:id', routers[':id']);

export default router;
