import fs from 'fs';

const setFromDockerSecrets = () => {
  const url = fs
    .readFileSync(process.env.MONGODB_URL_FILE_PATH!, 'utf8')
    .trim();
  const jwtSecret = fs
    .readFileSync(process.env.JWT_SECRET_FILE_PATH!, 'utf8')
    .trim();

  process.env.MONGODB_URL = url;
  process.env.JWT_SECRET = jwtSecret;
};

export default setFromDockerSecrets;
