import { intArg, mutationField, nonNull, stringArg } from 'nexus';
import { decipher, cipher } from '../../utils/chipper';
import * as bcrypt from 'bcryptjs';
import { AuthenticationError } from 'apollo-server-express';

export const changePasswordUser = mutationField('changePasswordUser', {
  type: 'Boolean',
  args: {
    id: nonNull(intArg()),
    password: nonNull(stringArg()),
    newPassword: nonNull(stringArg())
  },
  resolve: async (_parent, { id, password, newPassword }, ctx) => {
    const user = await ctx.prisma.tlUsers.findFirst({
      where: {
        id: id
      }
    });

    if (!user) {
      throw new AuthenticationError(`User not found by id ${id}`);
    }

    const [sterilizedPassword, sterilizedNewPassword] = await Promise.all([
      decipher()(password),
      decipher()(newPassword)
    ]);

    const [passwordValid, hashedNewPassword] = await Promise.all([
      bcrypt.compare(sterilizedPassword, user.password),
      bcrypt.hash(sterilizedNewPassword, 10)
    ]);

    if (!passwordValid) {
      throw new AuthenticationError('Password not correct');
    }

    await ctx.prisma.tlUsers.update({
      where: {
        id: id
      },
      data: {
        password: hashedNewPassword
      }
    });

    return true;
  }
});
