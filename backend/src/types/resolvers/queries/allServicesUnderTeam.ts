import { intArg, queryField } from 'nexus';
//this api queries all services assigned to team by master franchise
export const allServicesUnderTeam = queryField((t) => {
  t.list.field('allServicesUnderTeam', {
    type: 'TlServices',
    args: {
      userId: intArg()
    },
    resolve: async (_parent, { userId }, context) => {
      // get team id
      const teamId = await context.prisma.tlTeamUsers.findMany({
        where: {
          tl_user_id: userId
        }
      });
      const servicesUnderTeam = await context.prisma.tlServices.findMany({
        where: {
          tl_team_id: teamId[0].tl_team_id
        }
      });
      // if team id is a master franchise, get all jobs under master franchise
      return servicesUnderTeam;
    }
  });
});
