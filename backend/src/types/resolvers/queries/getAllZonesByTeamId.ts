import { intArg, list, queryField } from 'nexus';

export const getAllZonesByTeamId = queryField((t) => {
  t.field('getAllZonesByTeamId', {
    type: list('TlZones'),
    args: {
      team_id: intArg()
    },
    resolve: async (_parent, { team_id }, context) => {
      return context.prisma.tlZones.findMany({
        where: {
          team_id: team_id
        }
      });
    }
  });
});
