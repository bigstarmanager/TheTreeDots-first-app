import { Context } from '../../../context';
import { verify, sign } from 'jsonwebtoken';

const { JWT_SECRET } = process.env;
export const APP_SECRET = JWT_SECRET;

export interface UserCredentials {
  userId: number;
}

export function getUserCredentials(context: Context): UserCredentials {
  const Authorization = context.request.req.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const verifiedToken = verify(token, APP_SECRET) as UserCredentials;

    return verifiedToken;
  }

  return null;
}

export function getUserCredentialsByToken(authToken: string): UserCredentials {
  if ([null, undefined, 'null', 'undefined'].includes(authToken)) return null;
  try {
    const token = authToken.replace('Bearer ', '');
    return verify(token, APP_SECRET) as UserCredentials;
  } catch (error) {
    return null;
  }
}

export function generateJWT(payload: UserCredentials): string {
  return sign(payload, APP_SECRET);
}
