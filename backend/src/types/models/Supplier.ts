import { objectType } from 'nexus';

export const Supplier = objectType({
  name: 'Supplier',
  definition(t) {
    t.model.id();
    t.model.tenant_id();
    t.model.name();
    t.model.address();
    t.model.treedots_external_supplier_key();
  }
});

export const SupplierWithPagination = objectType({
  name: 'SupplierWithPagination',
  definition(t) {
    t.list.field('suppliers', { type: 'Supplier' });
    t.int('total_rows');
    t.int('total_page');
  }
});
