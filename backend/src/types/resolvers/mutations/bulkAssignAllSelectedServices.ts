import { mutationField, nonNull, arg, list } from 'nexus';

export const bulkAssignAllSelectedServices = mutationField('bulkAssignAllSelectedServices', {
  type: 'Boolean',
  args: {
    item: nonNull(list('bulkAssignAllSelectedServices'))
  },
  resolve: async (_parent, { item }, ctx) => {
    const updateService = async (tl_job_id: number, tl_service_type_id: number, tl_team_id: number) => {
      let service = await ctx.prisma.tlServices.findFirst({
        where: {
          tl_service_type_id,
          tl_job_id
        }
      });
      if (!service) {
        service = await ctx.prisma.tlServices.create({
          data: {
            tl_service_type_id,
            tl_job_id,
            tl_team_id
          }
        });
      } else {
        service = await ctx.prisma.tlServices.update({
          where: {
            id: service.id
          },
          data: {
            tl_team_id: tl_team_id
          }
        });
      }
      // if (tl_service_type_id == 4) {
      //   const listUpdates = await ctx.prisma.tlServices.findMany({
      //     where: {
      //       tl_service_type_id: { in: [1, 2] },
      //       tl_job_id
      //     }
      //   });
      //   listUpdates.map(async (job) => {
      //     await ctx.prisma.tlServices.update({
      //       where: {
      //         id: job.id
      //       },
      //       data: {
      //         tl_team_id
      //       }
      //     });
      //   });
      // }
    };

    item.forEach((listRow) => {
      if (listRow.type1) {
        updateService(listRow?.id, listRow?.type1?.service_type_id, listRow.type1.team_id);
      }
      if (listRow.type2) {
        updateService(listRow?.id, listRow?.type2?.service_type_id, listRow.type2.team_id);
      }

      if (listRow.type3) {
        updateService(listRow?.id, listRow?.type3?.service_type_id, listRow.type3.team_id);
      }
    });
    return true;
  }
});
