import { objectType } from 'nexus';

export const Spree = objectType({
  name: 'HubSpreeData',
  definition(t) {
    t.model.id();
    t.model.advocate_id();
    t.model.hub_id();
    t.model.tenant_id();
    t.model.delivery_date();
    t.model.start_date();
    t.model.end_date();
    t.model.Status();
    t.model.tenant();
    t.model.hub();
    t.model.user();
    t.model.active();
    t.list.field('pre_order_data', {
      type: 'PreOrder',
      resolve: (parent, _, context) => {
        return context.prisma.preOrder.findMany({
          where: {
            delivery_date: {
              equals: parent.delivery_date
            },
            pre_order_item: {
              some: {
                customer_buyer_id: parent.hub_id,
                sku: {
                  product: {
                    tenant_id: parent.tenant_id
                  }
                }
              }
            }
          }
        });
      }
    });
  }
});
