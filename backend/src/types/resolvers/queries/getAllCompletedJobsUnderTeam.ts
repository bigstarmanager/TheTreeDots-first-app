import { booleanArg, intArg, queryField, stringArg } from 'nexus';
import { MinMaxValue } from '../../utils/constant';
import { validatorPaging } from '../../utils/validator';

/*
query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
need to pass the logined user team id for the filter.
Then filter by tl_task where tl_service_task_type 1 and 6 is not null, in other words,  collection and delivery task is allocated.
If there is not collection/supplier opt for drop-off, check only delivery task. As task is also by order_item level, 
please take note that can be multiple delivery/collection task for 1 job.
*/

export const getAllCompletedJobsUnderTeam = queryField((t) => {
  t.field('getAllCompletedJobsUnderTeam', {
    type: 'TlJobList',
    args: {
      start_delivery_date: stringArg(),
      end_delivery_date: stringArg(),
      tl_user_id: intArg(),
      td_tenant_id: intArg(),
      delivery_window: stringArg(),
      td_invoice_id: intArg(),
      b2b_delivery: booleanArg(),
      zones: stringArg(),
      page: intArg(),
      limit: intArg()
    },
    resolve: async (
      _parent,
      {
        start_delivery_date,
        end_delivery_date,
        td_tenant_id,
        tl_user_id,
        delivery_window,
        td_invoice_id,
        b2b_delivery,
        zones,
        page,
        limit
      },
      context
    ) => {
      validatorPaging(page, limit);
      const take = limit;
      const skip = (page - 1) * limit;
      // Login User Id
      const userId = context.request.user.userId;
      // need to pass the logined user team id for the filter.
      const teamUsers = await context.prisma.tlTeamUsers.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          tl_user_id: userId
        }
      });
      const teamIds = teamUsers.map((t) => t.tl_team_id);
      const teamRelations = await context.prisma.tlTeamRelation.findMany({
        select: {
          tl_team_id: true
        },
        where: {
          parent_team_id: {
            in: teamIds
          }
        }
      });
      teamIds.push(...teamRelations.map((t) => t.tl_team_id));
      // user login doesn't belong to any team
      if (!teamIds.length) {
        return {
          totalItem: 0,
          items: []
        };
      }
      const condition: any = {};
      let startDeliveryDate = new Date(
        isNaN(+start_delivery_date) ? start_delivery_date : +start_delivery_date
      );
      let endDeliveryDate = new Date(isNaN(+end_delivery_date) ? end_delivery_date : +end_delivery_date);
      if (!(startDeliveryDate?.getTime() << 0)) startDeliveryDate = MinMaxValue.MIN_DATE;
      if (!(endDeliveryDate?.getTime() << 0)) endDeliveryDate = MinMaxValue.MAX_DATE;
      condition.delivery_date = {
        gte: startDeliveryDate,
        lte: endDeliveryDate
      };

      if (td_tenant_id) {
        condition.td_tenant_id = td_tenant_id;
      }
      if (delivery_window) {
        condition.delivery_window = delivery_window;
      }
      if (td_invoice_id) {
        const resultInvoiceIds = await context.prisma.$queryRaw(`
            SELECT DISTINCT(td_invoice_id)
            FROM tl_jobs
            WHERE CAST(td_invoice_id as char) like '%${td_invoice_id}%';
          `);
        const invoiceIds = resultInvoiceIds.map((r) => r.td_invoice_id);
        // Not Find td_invoice_id, set invoiceIds = -1 => jos = empty
        if (!invoiceIds.length) {
          invoiceIds.push(-1);
        }
        condition.td_invoice_id = {
          in: invoiceIds
        };
      }
      if (zones) {
        condition.zones = zones;
      }

      const query = {} as any;
      query.tl_service_task_type_id = { in: [1, 6] };
      if (tl_user_id) {
        query.tl_user_id = tl_user_id;
      } else {
        query.NOT = {
          tl_user_id: null
        };
      }

      const where = {
        ...condition,
        b2b_delivery: b2b_delivery,
        collection_requirement: 'yes',
        // query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
        TlServices: {
          some: {
            tl_team_id: {
              in: teamIds
            },
            // in other words, collection and delivery task is allocated.
            tl_service_type_id: {
              in: [1, 4]
            }
          }
        },
        // Then filter by tl_task where tl_service_task_type 1 and 6 is not null,
        TlTasks: {
          some: query
        }
      };

      const [totalItem, items] = await Promise.all([
        context.prisma.tlJobs.count({ where }),
        context.prisma.tlJobs.findMany({
          where,
          include: {
            TlServices: {
              where: {
                tl_team_id: {
                  in: teamIds
                }
              }
            },
            TlTasks: {
              where: query,
              include: {
                TlUsers: true
              }
            }
          },
          skip,
          take
        })
      ]);
      return {
        totalItem,
        items,
        geofenceZones: null
      } as any;
    }
  });
});
