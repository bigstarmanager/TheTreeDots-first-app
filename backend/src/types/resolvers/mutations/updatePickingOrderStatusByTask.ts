import { mutationField, intArg, nonNull, list } from 'nexus';

export const updatePickingOrderStatusByTask = mutationField('updatePickingOrderStatusByTask', {
  type: 'Boolean',
  args: {
    task_ids: nonNull(list(intArg())),
    status_id: intArg()
  },
  resolve: async (_parent, { task_ids, status_id }, ctx) => {
    await ctx.prisma.tlTasks.updateMany({
      where: {
        id: {
          in: task_ids
        },
        tl_service_task_type_id: 3
      },
      data: {
        tl_task_status_id: status_id
      }
    });
    return true;
  }
});
