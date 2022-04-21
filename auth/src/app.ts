import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import cors from 'cors';
import { routes, objects } from '@msnr-ticketing-app/common';

import routers from './routers';
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
  throw new objects.errors.RouteNotFoundError();
});
app.use(routes.middlewares.errors.errorHandler);

export default app;
