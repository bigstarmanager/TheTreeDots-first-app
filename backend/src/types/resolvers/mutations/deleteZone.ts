import { UserInputError } from 'apollo-server-errors';
import { mutationField, nonNull, intArg } from 'nexus';

export const deleteZone = mutationField('deleteZone', {
  type: 'Boolean',
  args: {
    zone_id: nonNull(intArg())
  },
  resolve: async (_parent, { zone_id }, ctx) => {
    try {
      const zone = await ctx.prisma.tlZones.findUnique({
        where: {
          id: zone_id
        }
      });
      if (!zone) {
        throw new UserInputError(`Invalid Zone`);
      }
      await ctx.prisma.tlZones.delete({
        where: {
          id: zone_id
        }
      });
      return true;
    } catch (e) {
      console.log(e);
      return e;
    }
  }
});
