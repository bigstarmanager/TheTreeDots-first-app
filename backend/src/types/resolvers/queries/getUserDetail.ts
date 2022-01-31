import { queryField, intArg } from 'nexus';
import { AuthenticationError } from 'apollo-server-errors';

export const getUserDetail = queryField((t) => {
  t.field('getUserDetail', {
    type: 'TlUsers',
    args: {
      id: intArg()
    },
    resolve: async (_parent, { id }, ctx) => {
      const user = await ctx.prisma.tlUsers.findFirst({
        where: {
          id: id
        }
      });

      if (!user) {
        throw new AuthenticationError(`User not found`);
      }

      return user;
    }
  });
});
