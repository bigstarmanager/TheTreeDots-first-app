import { queryField } from 'nexus';

export const allSecondaryTeamUnderPrimaryTeam = queryField((t) => {
  t.list.field('allSecondaryTeamUnderPrimaryTeam', {
    type: 'TlTeam',
    resolve: async (_parent, _args, ctx) => {
      const loginUserId = ctx.request.user.userId;

      const teamUsers = await ctx.prisma.tlTeamUsers.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          tl_user_id: loginUserId
        }
      });
      const teamIds = teamUsers.map((t) => t.tl_team_id);

      const teamRelations = await ctx.prisma.tlTeamRelation.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          parent_team_id: {
            in: teamIds
          }
        }
      });
      const childTeamId = teamRelations.map((t) => t.tl_team_id);

      const childTeams = await ctx.prisma.tlTeam.findMany({
        where: {
          id: {
            in: childTeamId
          }
        }
      });
      return childTeams;
    }
  });
});
