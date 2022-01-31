// this is a sample query

import { queryField, intArg } from 'nexus';

export const allDriverUnderTeam = queryField((t) => {
  t.list.field('allDriverUnderTeam', {
    type: 'TlUsers',
    args: {
      teamId: intArg()
    },
    resolve: async (_parent, { teamId }, context) => {
      const userRelation = await context.prisma.tlTeamUsers.findMany({
        where: {
          tl_team_id: teamId
        }
      });

      const userID = userRelation.map((id) => id.tl_user_id);
      //const userID1 = userID[0];

      const user = await context.prisma.tlUsers.findMany({
        where: {
          id: {
            in: userID
          }
        },
        include: {
          TlTeamUsers: true,
          TlTeamUserAccess: true
        }
      });
      const drivers = user.filter((item) => item.TlTeamUserAccess[0].tl_role_id === 3);
      return drivers;
    }
  });
});
