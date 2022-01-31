import { UserInputError } from 'apollo-server-errors';
import { mutationField, nonNull, intArg } from 'nexus';

export const updateAllSelectedCollectionService = mutationField('updateAllSelectedCollectionService', {
  type: 'TlServices',
  args: {
    tlServiceId: nonNull(intArg()),
    tlTeamId: intArg()
  },
  resolve: async (_parent, { tlServiceId, tlTeamId }, ctx) => {
    try {
      let [service, team] = await Promise.all([
        ctx.prisma.tlServices.findUnique({
          where: {
            id: tlServiceId
          }
        }),
        tlTeamId
          ? ctx.prisma.tlTeam.findUnique({
              where: {
                id: tlTeamId
              }
            })
          : null
      ]);
      if (!service) {
        throw new UserInputError(`Invalid Service`);
      }

      if (tlTeamId && !team) {
        throw new UserInputError(`Invalid Team`);
      }

      service = await ctx.prisma.tlServices.update({
        where: {
          id: tlServiceId
        },
        data: {
          tl_team_id: team?.id || null
        }
      });

      return service;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
});
