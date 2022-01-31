import { mutationField, nonNull, stringArg, intArg, list, arg } from 'nexus';

export const addNewZone = mutationField('addNewZone', {
  type: 'TlZones',
  args: {
    name: nonNull(stringArg()),
    description: nonNull(stringArg()),
    paths: list(arg({ type: 'PathInput' })),
    team_id: nonNull(intArg())
  },
  resolve: async (_parent, { name, description, paths, team_id }, ctx) => {
    return await ctx.prisma.tlZones.create({
      data: {
        name,
        description,
        paths,
        team_id
      }
    });
  }
});
