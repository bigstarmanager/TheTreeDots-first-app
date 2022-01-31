import { intArg, queryField, stringArg, booleanArg } from 'nexus';
import { MinMaxValue } from '../../utils/constant';
import { validatorPaging } from '../../utils/validator';

/*
query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
need to pass the logined user team id for the filter.
Then filter by tl_task where tl_service_task_type 1 and 6 is null, in other words, no allocation to collection,delivery task.
If there is no collection task/supplier opt for drop-off, check only for delivery.
As task is also by order_item level,  please take note that can be multiple delivery/collection task for 1 job.
*/
export const getAllFailedRegJobsUnderMasterFranchise = queryField((t) => {
  t.field('getAllFailedRegJobsUnderMasterFranchise', {
    type: 'TlJobList',
    args: {
      start_delivery_date: stringArg(),
      end_delivery_date: stringArg(),
      td_tenant_id: intArg(),
      delivery_window: stringArg(),
      td_invoice_id: intArg(),
      zones: stringArg(),
      vehicle_type: stringArg(),
      tl_service_task_type_id: intArg(),
      b2b_delivery: booleanArg(),
      page: intArg(),
      limit: intArg()
    },
    resolve: async (
      _parent,
      {
        start_delivery_date,
        end_delivery_date,
        td_tenant_id,
        delivery_window,
        td_invoice_id,
        vehicle_type,
        tl_service_task_type_id,
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
      // get team id
      const teamId = await context.prisma.tlTeamUsers.findMany({
        where: {
          tl_user_id: userId
        }
      });
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

      if (tl_service_task_type_id === 1) {
        condition.collection_date = {
          gte: startDeliveryDate,
          lte: endDeliveryDate
        };
      } else {
        condition.delivery_date = {
          gte: startDeliveryDate,
          lte: endDeliveryDate
        };
      }

      if (td_tenant_id) {
        condition.td_tenant_id = td_tenant_id;
      }

      if (vehicle_type) {
        condition.vehicle_requirement = vehicle_type;
      }

      if (delivery_window) {
        if (tl_service_task_type_id === 1) {
          condition.collection_window = delivery_window;
        } else {
          condition.delivery_window = delivery_window;
        }
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

      const where = {
        ...condition,
        b2b_delivery: b2b_delivery,
        // query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
        TlServices: {
          some: {
            tl_team_id: {
              in: teamIds
            },
            // in other words, no allocation to collection,delivery task.
            tl_service_type_id: {
              notIn: [1, 4]
            }
          }
        },
        // Then filter by tl_task where tl_service_task_type 1 and 6 is null,
        TlTasks: {
          some: {
            tl_service_task_type_id: tl_service_task_type_id,
            tl_task_status_id: 5
          }
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
              where: {
                tl_service_task_type_id: tl_service_task_type_id,
                tl_task_status_id: 5
              }
            },
            invoices: true
          },
          skip,
          take
        })
      ]);
      return {
        totalItem,
        items,
        teamId: teamId[0].tl_team_id
      } as any;
    }
  });
});
