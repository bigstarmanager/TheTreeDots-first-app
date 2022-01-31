import { queryField } from 'nexus';

export const allLocationUnderTeam = queryField((t) => {
  t.list.field('allLocationUnderTeam', {
    type: 'TlLocations',
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

      const teamLocations = await ctx.prisma.tlTeamLocations.findMany({
        select: {
          tl_location_id: true
        },
        where: {
          tl_team_id: {
            in: teamIds
          }
        }
      });
      const locationIds = teamLocations.map((t) => t.tl_location_id);

      const locations = await ctx.prisma.tlLocations.findMany({
        where: {
          id: {
            in: locationIds
          }
        }
      });
      return locations;
    }
  });
});
