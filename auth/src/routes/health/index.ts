import { Router } from 'express';

import handlers from './handlers';

const router = Router();

router.get('/healthz', handlers.healthz);

export default router;