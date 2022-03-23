import express from 'express';
import { json } from 'body-parser';

import routers from './routers';

const app = express();

app.use(json());

app.use('/auth', routers.auth);

export default app;
