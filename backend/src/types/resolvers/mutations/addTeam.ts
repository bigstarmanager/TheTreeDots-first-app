import { mutationField, nonNull, arg, stringArg } from 'nexus';

export const addTeam = mutationField('addTeam', {
  type: 'Boolean',
  args: {
    name: nonNull(stringArg())
  },
  resolve: async (_parent, { item }, ctx) => {
    try {
      const { name } = item;
      const team = await ctx.prisma.tlTeam.create({
        data: {
          name: name
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
});
