import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';

import routers from './routers';
import errorHandler from './middlewares/errors/error-handler';
import RouteNotFoundError from './lib/objects/errors/route-not-found-error';
import cookieSessionOptions from './lib/options/cookie-session/options';
import corsOptions from './lib/options/cors/options';

const app = express();

// trust ingress-nginx reverse proxy
app.set('trust proxy', true);

app.use(json());
app.use(cors(corsOptions));
app.use(cookieSession(cookieSessionOptions));

app.use('/auth', routers.auth);
app.all('*', () => {
  throw new RouteNotFoundError();
});
app.use(errorHandler);

export default app;
