import { Router } from 'express';

import routers from './routers';

const router = Router();

router.use('/health', routers.health);

export default router;
