import fs from 'fs';

const setFromDockerSecrets = () => {
  const redisHost = fs
    .readFileSync(process.env.REDIS_HOST_FILE_PATH!, 'utf8')
    .trim();
  process.env.REDIS_HOST = redisHost;
};

export default setFromDockerSecrets;
