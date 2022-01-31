import { mutationField, nonNull, arg } from 'nexus';

export const bulkAssignService = mutationField('bulkAssignService', {
  type: 'JSON',
  args: {
    item: nonNull(
      arg({
        type: 'bulkAssignService'
      })
    )
  },
  resolve: async (_parent, { item }, ctx) => {
    const { serviceId, tl_team_id } = item;
    const data = {
      tl_team_id: tl_team_id
    };
    await ctx.prisma.tlTasks.updateMany({
      where: {
        tl_service_id: {
          in: serviceId
        }
      },
      data: data
    });
    const teamAssignedInTlService = await ctx.prisma.tlServices.updateMany({
      where: {
        id: {
          in: serviceId
        }
      },
      data: data
    });
    return teamAssignedInTlService;
  }
});
