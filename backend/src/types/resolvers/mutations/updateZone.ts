import { UserInputError } from 'apollo-server-errors';
import { mutationField, nonNull, intArg, arg } from 'nexus';

// this api will update the tl_team_id, tl_location_id
export const updateZone = mutationField('updateZone', {
  type: 'TlZones',
  args: {
    zone_id: nonNull(intArg()),
    data: arg({ type: 'ZoneInput' })
  },
  resolve: async (_parent, { zone_id, data }, ctx) => {
    try {
      const zone = await ctx.prisma.tlZones.findUnique({
        where: {
          id: zone_id
        }
      });
      if (!zone) {
        throw new UserInputError(`Invalid zone id = ${zone_id}`);
      }
      return await ctx.prisma.tlZones.update({
        where: {
          id: zone_id
        },
        data: {
          ...data
        }
      });
    } catch (error) {
      return error;
    }
  }
});
