import { jwt } from '@msnr-ticketing-app/common';
import { CookieTestsTypes } from '../../types/cookies';

const signUpAndGetCookie: CookieTestsTypes.CreateUserAndCookie = () => {
  const user = {
    id: 'testing-id',
    email: 'test@test.com',
    password: 'password',
  };

  const token = jwt.sign({
    payload: {
      id: user.id,
      email: user.email,
    },
    secret: process.env.JWT_SECRET!,
  });

  const sessionObject = { jwt: token };
  const sessionString = JSON.stringify(sessionObject);

  const base64 = Buffer.from(sessionString).toString('base64');
  const cookie = [`session=${base64}`];

  return [user, cookie];
};

export default signUpAndGetCookie;
