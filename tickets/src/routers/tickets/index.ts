import { routes } from '@msnr-ticketing-app/common';
import { Router } from 'express';

import handlers from './handlers';
import routers from './routers';

const router = Router();

router.get('/', handlers.get);
router.post('/', routes.middlewares.auth.setUserData, handlers.post);
router.put('/', handlers.put);

router.use('/health', routers.health);
router.use('/:id', routers[':id']);

export default router;
