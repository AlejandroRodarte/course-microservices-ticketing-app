import fs from 'fs';

const setDockerSecrets = () => {
  const stripeApiKey = fs
    .readFileSync(process.env.STRIPE_API_KEY_FILE_PATH!, 'utf8')
    .trim();
  process.env.STRIPE_API_KEY = stripeApiKey;
};

if (['production-docker', 'development-docker'].includes(process.env.NODE_ENV!))
  setDockerSecrets();
