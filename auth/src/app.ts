import express from 'express';
import { json } from 'body-parser';

import routers from './routers';
import errorHandler from './middlewares/errors/error-handler';

const app = express();

app.use(json());

app.use('/auth', routers.auth);
app.use(errorHandler);

export default app;
