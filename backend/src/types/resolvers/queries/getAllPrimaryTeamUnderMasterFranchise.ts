import { intArg, queryField } from 'nexus';
import { getUserCredentials } from '../../utils/auth';
import { AuthenticationError } from 'apollo-server-errors';

export const getAllPrimaryTeamUnderMasterFranchise = queryField((t) => {
  t.list.field('getAllPrimaryTeamUnderMasterFranchise', {
    type: 'TlTeam',
    resolve: async (_parent, {}, context) => {
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
        const teamChild = await context.prisma.tlTeamRelation.findMany({
          where: {
            parent_team_id: user.TlTeamUsers[0].tl_team_id
          },
          include: {
            TlTeam: true
          }
        });
        const teams = teamChild.map((team) => {
          return team.TlTeam;
        });
        return teams;
      }

      throw new AuthenticationError(`No user found`);
    }
  });
});
