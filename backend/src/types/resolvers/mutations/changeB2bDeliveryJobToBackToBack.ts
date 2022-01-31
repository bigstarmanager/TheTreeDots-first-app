import { mutationField, intArg, nonNull, booleanArg, list } from 'nexus';

export const changeB2bDeliveryJobToBackToBack = mutationField('changeB2bDeliveryJobToBackToBack', {
  type: 'TlJobListResult',
  args: {
    job_ids: nonNull(list(intArg())),
    type: nonNull(booleanArg())
  },
  resolve: async (_parent, { job_ids, type }, ctx) => {
    const jobs = await ctx.prisma.tlJobs.findMany({
      where: {
        id: {
          in: job_ids
        }
      },
      include: {
        invoices: true
      }
    });
    const ids = [];
    const itemsFailed = [];

    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i].collection_requirement === 'yes') {
        ids.push(jobs[i].id);
      } else {
        itemsFailed.push(jobs[i]);
      }
    }

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
    const jobsResult = await ctx.prisma.tlJobs.findMany({
      where: {
        id: {
          in: ids
        }
      },
      include: {
        invoices: true
      }
    });
    return {
      itemsSuccess: jobsResult,
      itemsFailed: itemsFailed
    } as any;
  }
});
