const secure = process.env.NODE_ENV === 'development-gcloud';

const cookieSessionOptions: CookieSessionInterfaces.CookieSessionOptions = {
  signed: false,
  secure,
  sameSite: 'none',
};

export default cookieSessionOptions;
