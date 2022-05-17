import { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true,
};

export default corsOptions;
