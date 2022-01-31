import { objectType } from 'nexus';
export const deleteInvoicePaymentRes = objectType({
  name: 'deleteInvoicePaymentRes',
  definition(t) {
    t.int('invoice_id'), t.decimal('paid_amount');
  }
});
