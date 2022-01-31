import { compare, hash } from 'bcryptjs';
import { mutationField, nonNull, stringArg } from 'nexus';

import { generateJWT } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';
import { cipher, decipher } from '../../utils/chipper';
import * as uuid from 'uuid';

/**
 * This endpoint is used to confirm a credential to sign in in our platform
 * Accept:
 *  @ identity : String
 *  -- identity of the credential, such as email, mobile number, username
 *  @ password : String
 * Return:
 *  @ JWT Token
 *  @ v2's token (secret)
 *  @ User's data
 * Note:
 * This endpoint also need to facilitate account's old password that was exist in
 * legacy code of v2 application. The flow is when the system receive the request
 * to login, we will check the data from our database. If exist then we will check if v3's password
 * is exist. If it exist, then we will authenticate normally using bcrypt comparison.
 * If it isn't exist, then we will need to authenticate the password with v2's password in our DB.
 * In case the result is true and correct, then we will need to deciphering the password and then encrypt it
 * to Bcrypt before we reauthenticate the new password to generate a JWT Token.
 * To support this deciphering and ciphering process, we are borrowing the function that exist in v2 apps, which
 * is located in src/types/utils/chipper.
 */
export const signIn = mutationField('signIn', {
  type: 'TlUsers',
  args: {
    identity: nonNull(stringArg()),
    password: nonNull(stringArg())
  },
  resolve: async (_parent, { identity, password }, ctx) => {
    const decipherFunction = decipher();
    const v2Secret = await uuid.v1();
    const user = await ctx.prisma.tlUsers.findFirst({
      where: {
        email: identity
      }
    });

    if (!user) {
      throw new AuthenticationError(`No user found for that identity: ${identity}`);
    }

    const sterilizedPassword = await decipherFunction(password);

    const passwordValid = await compare(sterilizedPassword, user.password);
    if (!passwordValid) {
      console.log('--------------------------------');
      console.log('xa', 12);
      console.log('--------------------------------');
      throw new AuthenticationError('Invalid password');
    }
    return {
      tokenJWT: generateJWT({
        userId: user.id
      }),
      token: v2Secret,
      ...user
    };
  }
});
