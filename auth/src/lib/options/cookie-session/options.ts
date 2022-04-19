const secure =
  process.env.NODE_ENV === 'development-gcloud' &&
  (!process.env.FORCE_INSECURE_COOKIE ||
    process.env.FORCE_INSECURE_COOKIE === 'false');
const sameSite = process.env.NODE_ENV === 'development-gcloud' ? 'none' : 'lax';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  signed: false,
  secure,
  sameSite,
};

export default cookieSessionOptions;
