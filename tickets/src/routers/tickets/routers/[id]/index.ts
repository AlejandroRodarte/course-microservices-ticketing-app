import { Router } from 'express';

import handlers from './handlers';

const router = Router({ mergeParams: true });

router.get('/', handlers.get);
router.post('/', handlers.post);
router.put('/', handlers.put);

export default router;
