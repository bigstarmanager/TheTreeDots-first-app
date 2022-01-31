import { mutationField, intArg, nonNull, list } from 'nexus';

export const updatePackingOrdersStatus = mutationField('updatePackingOrdersStatus', {
  type: 'Boolean',
  args: {
    job_ids: nonNull(list(intArg())),
    status_id: intArg()
  },
  resolve: async (_parent, { job_ids, status_id }, ctx) => {
    await ctx.prisma.tlTasks.updateMany({
      where: {
        tl_job_id: {
          in: job_ids
        },
        tl_service_task_type_id: 4
      },
      data: {
        tl_task_status_id: status_id
      }
    });
    return true;
  }
});
