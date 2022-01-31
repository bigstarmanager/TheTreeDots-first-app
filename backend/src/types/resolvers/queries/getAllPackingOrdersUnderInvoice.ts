import { intArg, queryField } from 'nexus';

/*
query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
need to pass the logined user team id for the filter.
Then filter by tl_task where tl_service_task_type 1 and 6 is not null, in other words,  collection and delivery task is allocated.
If there is not collection/supplier opt for drop-off, check only delivery task. As task is also by order_item level, 
please take note that can be multiple delivery/collection task for 1 job.
*/
export const getAllPackingOrdersUnderInvoice = queryField((t) => {
  t.field('getAllPackingOrdersUnderInvoice', {
    type: 'TlJobs',
    args: {
      job_id: intArg()
    },
    resolve: async (_parent, { job_id }, context) => {
      return context.prisma.tlJobs.findUnique({
        where: {
          id: job_id
        },
        include: {
          TlServices: true,
          TlTasks: {
            where: {
              tl_service_task_type_id: 4
            },
            include: {
              TlUsers: true,
              OrderItem: {
                include: {
                  sku: {
                    include: {
                      product: true
                    }
                  },
                  order: true
                }
              }
            }
          }
        }
      }) as any;
    }
  });
});
