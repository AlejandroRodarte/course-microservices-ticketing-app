import fs from 'fs';

const setFromDockerSecrets = () => {
  const url = fs
    .readFileSync(process.env.MONGODB_URL_FILE_PATH!, 'utf8')
    .trim();
  process.env.MONGODB_URL = url;
};

export default setFromDockerSecrets;
