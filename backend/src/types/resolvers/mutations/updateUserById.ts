import { mutationField, intArg, nonNull, stringArg } from 'nexus';
import { decipher } from '../../utils/chipper';
import { hash } from 'bcryptjs';

export const updateUserById = mutationField('updateUserById', {
  type: 'TlUsers',
  args: {
    id: nonNull(intArg()),
    first_name: stringArg(),
    last_name: stringArg(),
    email: stringArg(),
    mobile: stringArg(),
    password: stringArg()
  },
  resolve: async (_parent, { id, first_name, last_name, email, mobile }, ctx) => {
    const data = {
      first_name: first_name,
      last_name: last_name,
      email: email,
      mobile: mobile
    };

    const updatedUser = await ctx.prisma.tlUsers.update({
      where: {
        id: id
      },
      data: data
    });
    return updatedUser;
  }
});
