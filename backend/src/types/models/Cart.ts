import { objectType } from 'nexus';

export const Cart = objectType({
  name: 'Cart',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.customer_id();
    t.model.created_at();
    t.model.updated_at();
    t.model.items();
    t.list.field('customer', {
      type: 'Customer',
      resolve: async (parent, _, context) => {
        return await context.prisma.customer.findMany({
          where: {
            id: parent.customer_id
          }
        });
      }
    });
  }
});

export const CartItem = objectType({
  name: 'CartItem',
  definition(t) {
    t.model.id();
    t.model.cart_id();
    t.model.sku_id();
    t.nonNull.decimal('price');
    t.model.order_quantity();
    t.nonNull.decimal('order_weight');
    t.model.created_at();
    t.model.updated_at();
    t.model.cart();
    t.model.sku();
    t.int('item_quantity');
  }
});

export const CartWithDeliveryAndMOV = objectType({
  name: 'CartWithDeliveryAndMOV',
  definition(t) {
    t.string('id');
    t.int('user_id');
    t.int('customer_id');
    t.field('customer', { type: 'Customer' });
    t.list.field('items', { type: 'CartItem' });
    t.list.field('cart_items', { type: 'CartItemWithDeliveryAndMOVExtend' });
    t.list.field('active_sprees', { type: 'CartWithDeliveryAndMOVExtend' });
  }
});

export const CartWithDeliveryAndMOVExtend = objectType({
  name: 'CartWithDeliveryAndMOVExtend',
  definition(t) {
    t.int('tenant_id'), t.decimal('minimum_order');
    t.string('name');
    t.string('alias_name');
    t.int('hub_id');
    t.field('delivery_date', { type: 'Date' });
    t.field('start_date', { type: 'Date' });
    t.field('end_date', { type: 'Date' });
  }
});

export const CartItemWithDeliveryAndMOVExtend = objectType({
  name: 'CartItemWithDeliveryAndMOVExtend',
  definition(t) {
    t.nonNull.field('supplier', { type: 'Tenant' });
    t.nonNull.list.field('items', { type: 'CartItem' });
  }
});
