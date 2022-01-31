import { intArg, queryField, stringArg } from 'nexus';
import { MinMaxValue } from '../../utils/constant';
import { validatorPaging } from '../../utils/validator';

// this api allows master franchise to see all jobs under master franchise team
export const allAssignedJobsUnderMasterFranchise = queryField((t) => {
  t.field('allAssignedJobsUnderMasterFranchise', {
    type: 'TlJobList',
    args: {
      userId: intArg(),
      start_delivery_date: stringArg(),
      end_delivery_date: stringArg(),
      td_tenant_id: intArg(),
      delivery_time_from: stringArg(),
      delivery_time_to: stringArg(),
      td_invoice_id: intArg(),
      vehicle_type: stringArg(),
      zones: stringArg(),
      page: intArg(),
      limit: intArg()
    },
    resolve: async (
      _parent,
      {
        userId,
        start_delivery_date,
        end_delivery_date,
        td_tenant_id,
        delivery_time_from,
        delivery_time_to,
        td_invoice_id,
        vehicle_type,
        zones,
        page,
        limit
      },
      context
    ) => {
      validatorPaging(page, limit);
      const take = limit;
      const skip = (page - 1) * limit;
      // get team id
      const teamId = await context.prisma.tlTeamUsers.findMany({
        where: {
          tl_user_id: userId
        }
      });
      const teamType = await context.prisma.tlTeamRelation.findMany({
        where: {
          tl_team_id: teamId[0].tl_team_id
        }
      });

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
      if (vehicle_type) {
        condition.vehicle_requirement = vehicle_type;
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
      const where = {
        ...condition,
        master_franchise_team_id: teamId[0].tl_team_id,
        TlServices: {
          some: {
            tl_service_type_id: { in: [3, 4] }
          },
          every: {
            tl_team_id: {
              not: null
            }
          }
        }
      };
      // Check MasterFranchise
      let isMasterFranchise = false;
      for (let index = 0; index < teamType.length; index++) {
        if (teamType[index].parent_team_id === null) {
          isMasterFranchise = true;
          break;
        }
      }
      const [totalItem, items] = await Promise.all([
        isMasterFranchise ? context.prisma.tlJobs.count({ where }) : 0,
        isMasterFranchise
          ? context.prisma.tlJobs.findMany({
              skip,
              take,
              where,
              include: {
                TlServices: {
                  include: {
                    TlServiceType: true
                  }
                },
                TlTasks: {
                  include: {
                    OrderItem: true
                  }
                },
                invoices: true,
                tenants: {
                  include: {
                    customer: {
                      where: {
                        customer_type_id: 3
                      }
                    }
                  }
                }
              }
            })
          : []
      ]);
      return {
        totalItem,
        items,
        teamId: teamId[0].tl_team_id
      };
    }
  });
});
