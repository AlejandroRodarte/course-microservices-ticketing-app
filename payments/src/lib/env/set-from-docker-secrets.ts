import fs from 'fs';

const setFromDockerSecrets = () => {
  const url = fs
    .readFileSync(process.env.MONGODB_URL_FILE_PATH!, 'utf8')
    .trim();
  const jwtSecret = fs
    .readFileSync(process.env.JWT_SECRET_FILE_PATH!, 'utf8')
    .trim();
  const stripeApiKey = fs
    .readFileSync(process.env.STRIPE_API_KEY_FILE_PATH!, 'utf8')
    .trim();

  process.env.MONGODB_URL = url;
  process.env.JWT_SECRET = jwtSecret;
  process.env.STRIPE_API_KEY = stripeApiKey;
};

export default setFromDockerSecrets;
