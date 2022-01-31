import { booleanArg, queryField } from 'nexus';
import { getUserCredentials } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';

export const getOneUser = queryField((t) => {
  t.field('getOneUser', {
    type: 'TlUsers',
    args: {
      active: booleanArg()
    },
    resolve: async (_parent, args, context) => {
      const credential = getUserCredentials(context);
      if (credential) {
        const user = await context.prisma.tlUsers.findFirst({
          where: {
            id: credential.userId
          }
        });
        if (!user) {
          throw new AuthenticationError(`No user found for that id: ${credential.userId}`);
        }
        return user;
      }

      throw new AuthenticationError(`No user found`);
    }
  });
});
