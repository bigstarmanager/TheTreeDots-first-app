import { objectType } from 'nexus';

export const Price = objectType({
  name: 'Price',
  definition(t) {
    t.model.id();
    t.model.sku_id();
    t.model.customer_buyer_id();
    t.model.account_number();
    t.float('price');
    t.model.created_at();
    t.model.last_user_id();
    t.model.description();
    t.model.active();
  }
});

export const Quotation = objectType({
  name: 'Quotation',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.customer_buyer_id();
    t.model.sku_id();
    t.float('unit_price');
    t.float('price');
    t.model.created_at();
    t.model.quoted_by();
    t.model.quoted_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.status();
    t.model.active();
  }
});

export const VQuotations = objectType({
  name: 'VQuotations',
  definition(t) {
    t.int('id');
    t.int('customer_id');
    t.string('customer');
    t.string('sku');
    t.int('halal');
    t.string('image');
    t.string('quotation_status');
    t.string('created_at');
    t.float('unit_price');
    t.float('price');
    t.int('sku_id');
    t.int('tenant_id');
    t.float('weight');
    t.float('unit_per_oom');
    t.string('oum');
    t.float('origin_price');
    t.int('requestor_id');
    t.int('requestor');
    t.string('image_requestor');
    t.int('quoted_by');
    t.string('image_quoted_by');
    t.int('approver_id');
    t.string('approver');
    t.int('status');
  }
});
