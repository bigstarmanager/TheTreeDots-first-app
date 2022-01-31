import { mutationField, intArg, nonNull, booleanArg, list } from 'nexus';

export const updateB2bDeliveryJob = mutationField('updateB2cDeliveryJob', {
  type: 'Boolean',
  args: {
    job_ids: nonNull(list(intArg())),
    type: nonNull(booleanArg())
  },
  resolve: async (_parent, { job_ids, type }, ctx) => {
    await ctx.prisma.tlJobs.updateMany({
      where: {
        id: {
          in: job_ids
        }
      },
      data: {
        b2b_delivery: type
      }
    });
    return true;
  }
});
