import { intArg, queryField } from 'nexus';
import { getUserCredentials } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';

export const allUser = queryField((t) => {
  t.list.field('allUser', {
    type: 'TlUsers',
    args: {
      role_id: intArg()
    },
    resolve: async (_parent, { role_id }, context) => {
      const credential = getUserCredentials(context);
      if (credential) {
        const user = await context.prisma.tlUsers.findFirst({
          where: {
            id: credential.userId
          },
          include: {
            TlTeamUsers: true
          }
        });
        if (!user) {
          throw new AuthenticationError(`No user found for that id: ${credential.userId}`);
        }
        const team_ids = user.TlTeamUsers.map((item) => {
          return item.tl_team_id;
        });
        return context.prisma.tlUsers.findMany({
          where: {
            TlTeamUsers: {
              some: {
                tl_team_id: { in: team_ids }
              }
            },
            TlTeamUserAccess: {
              some: {
                tl_role_id: role_id ? role_id : { in: [1, 2] }
              }
            }
          }
        });
      }

      throw new AuthenticationError(`No user found`);
    }
  });
});
