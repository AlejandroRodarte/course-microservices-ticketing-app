import express from 'express';
import { json } from 'body-parser';

import routes from './routes';

const app = express();

app.use(json());

app.use('/auth', routes);

export default app;