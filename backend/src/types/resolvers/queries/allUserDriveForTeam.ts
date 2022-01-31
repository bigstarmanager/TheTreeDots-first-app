import { queryField } from 'nexus';
import { getUserCredentials } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';

export const allUserDriveForTeam = queryField((t) => {
  t.list.field('allUserDriveForTeam', {
    type: 'TlUsers',
    resolve: async (_parent, _args, context) => {
      const credential = getUserCredentials(context);
      if (!credential) {
        throw new AuthenticationError(`No user found`);
      }
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
              tl_role_id: 3
            }
          }
        }
      });
    }
  });
});
