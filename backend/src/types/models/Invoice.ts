import { objectType } from 'nexus';

export const Invoice = objectType({
  name: 'Invoice',
  definition(t) {
    t.model.id();
    t.model.invoice_id();
    t.model.invoice_number();
    t.model.code();
    t.model.actual_delivery_date();
    t.model.last_user_id();
    t.model.description();
    t.model.amount();
    t.model.cod_paid_amount();
    t.model.payment_type();
    t.model.credit_term();
    t.model.due_date();
    t.model.status_id();
    t.model.resync_status();
    t.model.delivery_address();
    t.model.billing_address();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
    t.model.OrderItem();
    t.model.latlng();
    t.model.invoiceItems();
  }
});

export const InvoiceItem = objectType({
  name: 'InvoiceItem',
  definition(t) {
    t.model.id();
    t.model.active();
    t.model.invoice_id();
    t.model.order_item_id();
    t.model.sku_id();
    t.model.product_type_id();
    t.model.user_id();
    t.model.driver_collect_user_id();
    t.model.driver_delivery_user_id();
    t.model.customer_seller_id();
    t.model.customer_buyer_id();
    t.model.group_id();
    t.model.amount_qty();
    t.model.weight();
    t.model.total_qty();
    t.model.total_weight();
    t.model.catch_weight();
    t.model.origin_unit_price();
    t.model.sale_unit_price();
    t.model.total_price();
    t.model.tax();
    t.model.tax_rate();
    t.model.is_order_by_weight();
    t.model.created_at();
    t.model.updated_at();
    t.model.last_user_id();
    t.model.description();
    t.model.active();
    t.model.order_item_status_id();
    t.model.status_note();
    t.model.sku_code();
    t.model.stock_location_id();
    t.model.stock_location();
    t.model.product_name();
  }
});

export const InvoiceStatus = objectType({
  name: 'InvoiceStatus',
  definition(t) {
    t.model.id();
    t.model.status_name();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
  }
});

export const Payment = objectType({
  name: 'Payment',
  definition(t) {
    t.model.id();
    t.model.invoice_id();
    t.model.xero_payment_id();
    t.model.xero_account_id();
    t.model.xero_account_name();
    t.float('amount');
    t.model.reference_number();
    t.model.created_by();
    t.model.created_at();
    t.model.updated_by();
    t.model.updated_at();
    t.model.active();
  }
});

export const PeppolInvoice = objectType({
  name: 'PeppolInvoice',
  definition(t) {
    t.model.id();
    t.model.invoice_id();
    t.model.invoice_number();
    t.model.guid();
    t.model.data();
    t.model.storecove_tenant_id();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
  }
});

export const Statement = objectType({
  name: 'Statement',
  definition(t) {
    t.model.id();
    t.model.phone();
    t.model.sender();
    t.model.filepath();
    t.model.content();
    t.model.status();
    t.model.created_at();
    t.model.updated_at();
  }
});
