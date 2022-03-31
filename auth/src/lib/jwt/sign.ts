import jwt from 'jsonwebtoken';
import { JwtTypes } from '../types/jwt';

const sign: JwtTypes.SignFunction = (payload) => {
  const token = jwt.sign(payload, process.env.JWT_SECRET!);
  return token;
};

export default sign;
