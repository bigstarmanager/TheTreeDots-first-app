import { inputObjectType } from 'nexus';

export const ItemVoucherifyType = inputObjectType({
  name: 'ItemVoucherifyType',
  definition(t) {
    t.nonNull.int('order_item_product_id');
    t.nonNull.int('order_item_product_qty');
    t.nonNull.int('order_item_product_price');
  }
});

export const VoucherifyInputType = inputObjectType({
  name: 'VoucherifyInputType',
  definition(t) {
    t.nonNull.string('voucher_code');
    t.nonNull.int('customer_id');
    t.nonNull.string('source_id');
    t.nonNull.string('customer_name');
    t.nonNull.int('amount_order');
    t.nonNull.string('metadata_locale');
    t.nonNull.string('metadata_hub_name');
    t.nonNull.boolean('metadata_b2b');
    t.nonNull.boolean('metadata_b2c');
    t.nonNull.list.field('items', { type: ItemVoucherifyType });
  }
});
