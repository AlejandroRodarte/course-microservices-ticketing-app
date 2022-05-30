const validEnvs = ['production', 'development-gcloud'];

const secure =
  validEnvs.includes(process.env.NODE_ENV!) &&
  (!process.env.FORCE_INSECURE_COOKIE ||
    process.env.FORCE_INSECURE_COOKIE === 'false');
const sameSite = validEnvs.includes(process.env.NODE_ENV!) ? 'none' : 'lax';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  signed: false,
  secure,
  sameSite,
  domain: process.env.COOKIE_SESSION_DOMAIN,
};

export default cookieSessionOptions;
