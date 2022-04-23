import { Router } from 'express';

import handlers from './handlers';
import routers from './routers';

const router = Router();

router.get('/', handlers.get);

router.use('/health', routers.health);
router.use('/:id', routers[':id']);

export default router;
