import express from 'express';
import { json } from 'body-parser';

import routers from './routers';
import errorHandler from './middlewares/errors/error-handler';
import RouteNotFoundError from './lib/objects/errors/route-not-found-error';

const app = express();

app.use(json());

app.use('/auth', routers.auth);
app.all('*', () => {
  throw new RouteNotFoundError();
});
app.use(errorHandler);

export default app;
