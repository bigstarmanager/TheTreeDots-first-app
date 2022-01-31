import { objectType } from 'nexus';

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.model.id();
    t.model.order_status_id();
    t.model.po_number();
    t.model.standalone();
    t.model.delivery_date();
    t.field('delivery_time', { type: 'String' });
    t.model.stripe_transaction_id();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.token();
    t.model.active();
  }
});

export const OrderItem = objectType({
  name: 'OrderItem',
  definition(t) {
    t.model.id();
    t.model.order_id();
    t.model.sku_id();
    t.model.product_type_id();
    t.model.user_id();
    t.model.driver_collect_user_id();
    t.model.driver_delivery_user_id();
    t.model.customer_buyer_id();
    t.model.customer_seller_id();
    t.model.group_id();
    t.model.invoice_id();
    t.model.amount_qty();
    t.float('weight');
    t.model.total_qty();
    t.float('total_weight');
    t.model.catch_weight();
    t.float('origin_unit_price');
    t.float('sale_unit_price');
    t.float('total_price');
    t.float('tax');
    t.float('tax_rate');
    t.model.cod();
    t.model.is_order_by_weight();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.order_item_status_id();
    t.model.status_note();
    t.model.active();
    t.model.sku();
    t.model.order();
    t.model.invoice();
    t.model.customer();
    t.model.product_name();
    t.model.sku_code();
    t.model.stock_location();
    t.model.stock_location_id();
  }
});

export const OrderItemAmendment = objectType({
  name: 'OrderItemAmendment',
  definition(t) {
    t.model.id();
    t.model.order_item_id();
    t.model.old_qty();
    t.model.new_qty();
    t.model.is_approved();
    t.model.created_by();
    t.model.created_at();
    t.model.updated_by();
    t.model.updated_at();
    t.model.active();
  }
});

export const OrderItemDispute = objectType({
  name: 'OrderItemDispute',
  definition(t) {
    t.model.id();
    t.model.order_item_id();
    t.model.reason();
    t.model.remedy();
    t.model.status();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
  }
});

export const OrderItemStatus = objectType({
  name: 'OrderItemStatus',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
  }
});

export const OrderJob = objectType({
  name: 'OrderJob',
  definition(t) {
    t.model.id();
    t.model.order_id();
    t.model.every();
    t.model.delivery_time();
    t.model.until();
    t.model.next_placed_at();
    t.model.tenant_id();
    t.model.user_id();
    t.model.customer_buyer_id();
    t.model.description();
    t.model.po_number();
    t.model.standalone();
  }
});

export const OrderStatus = objectType({
  name: 'OrderStatus',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const PoolingInformation = objectType({
  name: 'PoolingInformation',
  definition(t) {
    t.model.id();
    t.model.sku_id();
    t.model.hub_id();
    t.field('close_date', { type: 'Date' });
    t.model.type();
    t.model.created_at();
    t.model.active();
  }
});

export const PoolingInformationDetail = objectType({
  name: 'PoolingInformationDetail',
  definition(t) {
    t.model.id();
    t.model.pooling_information_detail_id();
    t.model.order_item_id();
    t.model.total_order();
    t.model.isPooled();
    t.model.pooling_information_id();
    t.model.created_at();
    t.model.active();
  }
});

export const PreOrder = objectType({
  name: 'PreOrder',
  definition(t) {
    t.model.id();
    t.model.order_status_id();
    t.model.spree_id();
    t.model.po_number();
    t.model.standalone();
    t.model.delivery_date();
    t.model.delivery_time();
    t.model.stripe_transaction_id();
    t.model.charge_date();
    t.model.close_date();
    t.model.payment_date();
    t.model.payment_status_id();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.token();
    t.model.active();
    t.model.order_status();
    t.model.user();
    t.model.paymentB2c();
    t.field('supplier', {
      type: 'Customer',
      resolve: async (parent, _, context) => {
        // get sprees data info
        if (parent.spree_id) {
          const spree = await context.prisma.hubSpreeData.findUnique({
            where: { id: parent.spree_id },
            select: { tenant_id: true }
          });
          // get customer info base on hub sprees
          return await context.prisma.customer.findFirst({
            where: {
              id: spree.tenant_id,
              customer_type_id: 3
            }
          });
        } else {
          return;
        }
      }
    });
    t.list.field('pre_order_item', {
      type: 'PreOrderItem',
      resolve: (parent) => {
        return parent['pre_order_item'];
      }
    });
  }
});

export const PaymentB2c = objectType({
  name: 'PaymentB2c',
  definition(t) {
    t.model.id();
    t.model.order_total();
    t.model.discount_amount();
    t.model.voucher_code();
    t.model.voucher_discount_type();
    t.model.voucher_discount();
    t.model.voucher_minimum_amount();
    t.model.stripe_transaction_id();
    t.model.status();
    t.model.active();
    t.model.created_date();
    t.model.description();
  }
});

export const PreOrdersB2b = objectType({
  name: 'PreOrdersB2b',
  definition(t) {
    t.model.id();
    t.model.actual_order_id();
    t.model.order_status_id();
    t.model.po_number();
    t.model.standalone();
    t.field('delivery_date', { type: 'Date' });
    t.model.delivery_time();
    t.model.stripe_transaction_id();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.token();
    t.model.active();
  }
});

export const PreOrderItem = objectType({
  name: 'PreOrderItem',
  definition(t) {
    t.model.id();
    t.model.order_id();
    t.model.sku_id();
    t.model.product_type_id();
    t.model.user_id();
    t.model.driver_collect_user_id();
    t.model.driver_delivery_user_id();
    t.model.customer_buyer_id();
    t.model.customer_seller_id();
    t.model.group_id();
    t.model.invoice_id();
    t.model.amount_qty();
    t.model.total_qty();
    t.float('origin_unit_price');
    t.float('sale_unit_price');
    t.float('total_price');
    t.float('tax');
    t.float('discount');
    t.float('original_sale_unit_price');
    t.float('original_total_price');
    t.float('original_tax');
    t.model.sku_deal_id();
    t.model.cod();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.order_item_status_id();
    t.model.status_note();
    t.model.active();
    t.model.sku();
    t.model.user();
    t.model.order_item_status();
    t.model.hub();
    t.model.pool_item();
  }
});

export const PreOrderItemsB2b = objectType({
  name: 'PreOrderItemsB2b',
  definition(t) {
    t.model.id();
    t.model.order_id();
    t.model.sku_id();
    t.model.product_type_id();
    t.model.user_id();
    t.model.customer_buyer_id();
    t.model.customer_seller_id();
    t.model.group_id();
    t.model.amount_qty();
    t.float('weight');
    t.model.total_qty();
    t.model.catch_weight();
    t.float('origin_unit_price');
    t.float('sale_unit_price');
    t.float('total_price');
    t.float('tax');
    t.float('tax_rate');
    t.model.cod();
    t.model.is_order_by_weight();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.order_item_status_id();
    t.model.status_note();
    t.model.active();
  }
});

export const Pool = objectType({
  name: 'Pool',
  definition(t) {
    t.model.id();
    t.model.sku_id();
    t.model.pool_qty();
    t.model.is_fullfilled();
    t.model.remaining_qty();
    t.model.hub_id();
    t.model.close_date();
    t.model.close_date_updated_at();
    t.model.created_at();
    t.model.updated_at();
    t.model.pool_item();
  }
});

export const PoolItems = objectType({
  name: 'PoolItems',
  definition(t) {
    t.model.id();
    t.model.pool_id();
    t.model.pre_order_item_id();
    t.model.qty();
    t.model.user_id();
    t.model.pool();
    t.model.PreOrderItem();
  }
});

export const GroupBuyCheckout = objectType({
  name: 'GroupBuyCheckout',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.int('advocate_id');
    t.nonNull.int('hub_id');
    t.nonNull.int('tenant_id');
    t.nonNull.string('delivery_date');
    t.nonNull.string('start_date');
    t.nonNull.string('end_date');
    t.nonNull.int('Status');
    t.nonNull.boolean('active');
    t.string('payment_status_id');
    t.list.field('preOrders', { type: 'JSON' });
    t.nonNull.int('preOrderId');
  }
});

export const PoolUserData = objectType({
  name: 'PoolUserData',
  definition(t) {
    t.nonNull.string('full_name');
    t.nonNull.string('mobile');
    t.nonNull.string('item_type');
    t.nonNull.int('pooling_qty');
    t.nonNull.int('non_pooling_qty');
    t.nonNull.int('successfully_pooled');
    t.nonNull.int('pending_pooling');
  }
});

export const B2COrder = objectType({
  name: 'B2COrder',
  definition(t) {
    t.nonNull.int('order_id');
    t.int('order_id_payment_b2c');
    t.nonNull.int('status_id');
    t.nonNull.string('status');
    t.nonNull.string('delivery_date');
    t.string('delivery_time');
    t.nonNull.string('order_date');
    t.nonNull.string('info');
    t.nonNull.int('user_id');
    t.int('customer_buyer_id');
    t.nonNull.string('customer');
    t.nonNull.string('alias_name');
    t.nonNull.int('items');
    t.nonNull.float('prices');
    t.nonNull.float('taxes');
    t.string('description');
    t.int('standalone');
    t.string('po_number');
    t.nonNull.int('active');
    t.nonNull.int('tenant_id');
    t.nonNull.string('tenant_name');
    t.nonNull.int('hub');
    t.string('user_name');
    t.nonNull.string('mobile');
    t.string('delivery_method');
    t.int('delivery_fee');
    t.field('paymentB2c', {
      type: 'PaymentB2c'
    });
  }
});

export const B2COrderList = objectType({
  name: 'B2COrderList',
  definition(t) {
    t.string('order_id');
    t.list.field('child', {
      type: 'B2COrder'
    });
  }
});

export const B2COrderDetails = objectType({
  name: 'B2COrderDetails',
  definition(t) {
    t.boolean('active');
    t.int('amount_qty');
    t.string('close_date');
    t.int('id');
    t.string('item_status');
    t.string('logistic_type');
    t.string('oom');
    t.int('order_id');
    t.int('order_item_id');
    t.int('order_item_status_id');
    t.int('order_status_id');
    t.decimal('price');
    t.decimal('price_total');
    t.string('product');
    t.int('quantity');
    t.string('sku');
    t.int('sku_id');
    t.decimal('tax');
    t.string('tax_rate');
    t.int('tenant_id');
  }
});

export const GeoOrder = objectType({
  name: 'GeoOrder',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('delivery_date');
    t.nonNull.int('order_status_id');
    t.nonNull.int('group_id');
    t.int('customer_buyer_id');
    t.nonNull.int('tenant_id');
    t.nonNull.int('items');
    t.list.field('items_id', {
      type: 'JSON'
    });
    t.field('latlng', { type: 'JSON' });
  }
});
