import { intArg, queryField, stringArg } from 'nexus';
import { MinMaxValue } from '../../utils/constant';
import { validatorPaging } from '../../utils/validator';

/*
query the tl_jobs table, filter using the tl_team_id in tl_services table which is a foreign key to tl_jobs,
need to pass the logined user team id for the filter.
Then filter by tl_task where tl_service_task_type 1 and 6 is not null, in other words,  collection and delivery task is allocated.
If there is not collection/supplier opt for drop-off, check only delivery task. As task is also by order_item level, 
please take note that can be multiple delivery/collection task for 1 job.
*/
export const getAllPickingOrdersUnderTeam = queryField((t) => {
  t.field('getAllPickingOrdersUnderTeam', {
    type: 'TlJobList',
    args: {
      start_delivery_date: stringArg(),
      end_delivery_date: stringArg(),
      td_tenant_id: intArg(),
      tl_user_id: intArg(),
      delivery_time_from: stringArg(),
      delivery_time_to: stringArg(),
      td_invoice_id: intArg(),
      status_task_id: intArg(),
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
        delivery_time_from,
        delivery_time_to,
        td_invoice_id,
        status_task_id,
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

      if (delivery_time_from) {
        condition.delivery_time_from = { gte: new Date(`1970-01-01T${delivery_time_from}.000Z`) };
      }

      if (delivery_time_to) {
        condition.delivery_time_to = { lte: new Date(`1970-01-01T${delivery_time_to}.000Z`) };
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
      const query = {
        tl_service_task_type_id: 3
      } as any;

      if (tl_user_id) {
        query.tl_user_id = tl_user_id;
      }

      const where = {
        ...condition,
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

      const items = await context.prisma.tlJobs.findMany({
        where,
        include: {
          TlServices: {
            where: {
              tl_team_id: {
                in: teamIds
              }
            },
            include: {
              TlTeam: {
                include: {
                  TlTeamUsers: {
                    include: {
                      TlUsers: true
                    }
                  }
                }
              }
            }
          },
          TlTasks: {
            where: query,
            include: {
              TlUsers: true
            }
          }
        }
      });
      const data = items.filter((i) => {
        const array = i.TlTasks;
        if (!status_task_id) return true;
        if (status_task_id === 4) {
          return array.filter((item) => item.tl_task_status_id === 4).length === array.length;
        } else if (status_task_id === 3) {
          return (
            array.find((item) => item.tl_task_status_id === 3) ||
            (array.find((item) => item.tl_task_status_id === 2) &&
              array.find((item) => item.tl_task_status_id === 4))
          );
        } else if (status_task_id === 2) {
          return !array.find((item) => item.tl_task_status_id === 3 || item.tl_task_status_id === 4);
        }
      });

      return {
        totalItem: data.length,
        items: data.slice(skip, skip + limit)
      } as any;
    }
  });
});
