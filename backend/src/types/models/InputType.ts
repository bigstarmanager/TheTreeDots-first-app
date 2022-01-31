import { inputObjectType, list } from 'nexus';

export const CartItemInputType = inputObjectType({
  name: 'CartItemInput',
  definition(t) {
    t.int('customer_id');
    t.nonNull.int('sku_id');
    t.nonNull.decimal('price');
    t.nonNull.int('order_quantity');
    t.nonNull.decimal('order_weight');
  }
});

export const TenantInputType = inputObjectType({
  name: 'TenantInput',
  definition(t) {
    t.nonNull.string('account_number');
    t.nonNull.string('name');
    t.nonNull.string('alias_name');
    t.nonNull.int('customer_type_id');
    t.nonNull.int('collection_type_id');
    t.nonNull.string('delivery_instruction');
    t.nonNull.decimal('delivery_charge');
    t.nonNull.int('payment_type');
    t.nonNull.decimal('minimum_order');
    t.nonNull.boolean('hub');
    t.nonNull.boolean('halal_products');
    t.nonNull.boolean('cod');
    t.nonNull.int('credit_term');
    t.nonNull.string('xero_id');
    t.nonNull.string('voucherify_id');
    t.nonNull.boolean('active');
    t.nonNull.string('profile');
    t.nonNull.string('registration_number');
    t.nonNull.string('tax_registration_number');
    t.nonNull.decimal('tax_rate');
    t.nonNull.string('email');
    t.nonNull.string('first_name');
    t.nonNull.string('last_name');
    t.nonNull.int('email_notification');
    t.nonNull.int('class_id');
    t.nonNull.int('default_credit_card_term');
  }
});
export const DeliveryDayInputType = inputObjectType({
  name: 'DeliveryDayInput',
  definition(t) {
    t.int('customer_id');
    t.int('day_id');
    t.int('id');
  }
});

export const UserAndPersonInputType = inputObjectType({
  name: 'UserAndPersonInput',
  definition(t) {
    t.nonNull.string('country_code');
    t.nonNull.int('customer_id');
    t.nonNull.string('email');
    t.nonNull.string('phone');
    t.nonNull.int('country_id');
    t.nonNull.string('first_name');
    t.nonNull.string('last_name');
    t.nonNull.string('position');
    t.nonNull.int('tenant_customer_id');
  }
});

export const addFavouriteKusInputType = inputObjectType({
  name: 'FavouriteKusInput',
  definition(t) {
    t.nonNull.string('account_number');
    t.nonNull.int('user_id');
    t.field('list_sku_id', {
      type: list('Int')
    });
  }
});
export const addPersonInputType = inputObjectType({
  name: 'PersonInput',
  definition(t) {
    t.nonNull.int('user_id');
    t.nonNull.int('id');
    t.nonNull.string('country_code');
    t.nonNull.int('customer_id');
    t.nonNull.string('email');
    t.nonNull.string('phone');
    t.nonNull.string('fax');
    t.nonNull.string('first_name');
    t.nonNull.string('last_name');
    t.nonNull.int('user_type_id');
    t.nonNull.string('position');
    t.nonNull.int('active');
  }
});
export const addUserInputType = inputObjectType({
  name: 'AddUserInput',
  definition(t) {
    t.nonNull.int('country_id');
    t.nonNull.int('customer_id');
    t.string('email');
    t.nonNull.string('mobile');
    t.nonNull.string('first_name');
    t.nonNull.string('last_name');
    t.nonNull.int('user_type_id');
    t.nonNull.int('buyer_type');
    t.nonNull.string('password');
  }
});
export const AddInvoicePaymentType = inputObjectType({
  name: 'AddInvoicePaymentInput',
  definition(t) {
    t.nonNull.int('invoice_id');
    t.nonNull.string('xero_account_id');
    t.nonNull.string('xero_payment_id');
    t.nonNull.string('xero_account_name');
    t.nonNull.decimal('amount');
    t.nonNull.int('user_id');
    t.nonNull.string('user_name');
    t.nonNull.string('reference_number');
    t.nonNull.string('log_description');
  }
});

export const ClosingTimeBySkuByIdInput = inputObjectType({
  name: 'closingTimeBySkuIdInput',
  definition(t) {
    t.nonNull.int('sku_id');
    t.nonNull.int('product_type_id');
    t.nonNull.string('date');
  }
});

export const CancelOrderRestockInput = inputObjectType({
  name: 'CancelOrderRestockInput',
  definition(t) {
    t.nonNull.int('orderItemId');
    t.nonNull.int('restockQty');
    t.nonNull.int('skuId');
    t.nonNull.int('customerSellerId');
    t.nonNull.int('productTypeId');
    t.nonNull.int('totalQty');
    t.nonNull.int('active');
  }
});

export const GroupBuyCheckoutInputCardItem = inputObjectType({
  name: 'GroupBuyCheckoutInputCardItem',
  definition(t) {
    t.nonNull.int('tenantId');
    t.nonNull.int('hubId');
    t.field('cartItemIds', {
      type: list('String')
    });
  }
});

export const AddSupplierDashboardAdmin = inputObjectType({
  name: 'AddSupplierDashboardAdmin',
  definition(t) {
    t.int('id');
    t.int('tenant_id');
    t.string('name');
    t.string('alias_name');
    t.string('account_number');
    t.int('customer_type_id'); // Tenant
    t.int('collection_type_id');
    t.boolean('hub');
    t.string('profile');
    t.boolean('halal_products');
    t.boolean('cod');
    t.int('credit_term');
    t.int('payment_type');
    t.string('delivery_instruction');
    t.decimal('delivery_charge');
    t.decimal('minimum_order');
    t.boolean('active');
    t.string('xero_id');
    t.string('voucherify_id');
    //tenants
    t.string('registration_number');
    t.string('tax_registration_number');
    t.decimal('tax_rate');
    t.string('email');
    t.string('first_name');
    t.string('last_name');
    t.int('email_notification');
    t.int('tenant_level');
    t.int('default_credit_card_term');
    t.string('logo');
    t.int('lead_days');
    t.decimal('commission_rate');
    //new field for logo/image properties
    t.string('base64');
    t.string('imageType');
  }
});

export const StockLocationInput = inputObjectType({
  name: 'StockLocationInput',
  definition(t) {
    t.int('stock_location_id');
    t.string('name');
    t.string('alias_name');
    t.int('group_id');
    t.int('tenant_id');
    t.int('collection_type_id');
    t.boolean('active');
    t.string('created_by');
    t.string('updated_by');
  }
});

export const StockLocationAddressInput = inputObjectType({
  name: 'StockLocationAddressInput',
  definition(t) {
    t.int('id');
    t.int('stock_location_id');
    t.string('floor_number');
    t.string('street_number');
    t.string('road');
    t.string('building');
    t.string('unit');
    t.string('stall');
    t.string('city');
    t.string('state');
    t.string('postal_code');
    t.string('latlng');
    t.int('country_id');
    t.int('address_type_id');
    t.field('address_type', {
      type: 'AddressTypeInput'
    });
    t.field('country', {
      type: 'countryInput'
    });
    t.boolean('active');
    t.boolean('is_default');
    t.string('created_by');
    t.string('updated_by');
  }
});

export const AddressTypeInput = inputObjectType({
  name: 'AddressTypeInput',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('description');
    t.boolean('active');
  }
});

export const countryInput = inputObjectType({
  name: 'countryInput',
  definition(t) {
    t.int('id');
    t.string('name');
    t.string('description');
    t.boolean('active');
    t.string('currency_code');
    t.string('currency_symbol');
    t.boolean('active');
  }
});

export const SupplierInput = inputObjectType({
  name: 'SupplierInput',
  definition(t) {
    t.int('id');
    t.int('tenant_id');
    t.string('name');
    t.string('address');
    t.string('treedots_external_supplier_key');
    t.boolean('active');
  }
});

export const SkusInput = inputObjectType({
  name: 'SkusInput',
  definition(t) {
    t.int('skuId'), //only use this for update sku info
      t.string('code'),
      t.string('name'),
      t.string('barcode'),
      t.int('supplier_id'),
      t.decimal('external_sku_id'),
      t.string('supplier_product_name'),
      t.decimal('volume_length'),
      t.decimal('volume_height'),
      t.decimal('volume_breadth'),
      t.boolean('details_estimation'),
      t.decimal('temperature'),
      t.field('weight', {
        type: weightSkusInput
      }),
      t.string('description'),
      t.string('packaging'),
      t.string('country_of_origin'),
      t.decimal('expiry'),
      t.decimal('freshness'),
      t.boolean('catch_weight'),
      t.string('external_sku_key'),
      t.decimal('unit_price'),
      t.decimal('unit_amount'),
      t.decimal('price'),
      t.int('stock_location_id'),
      t.list.field('inventory', {
        type: InventorySkusInput
      }),
      t.boolean('active');
  }
});

const weightSkusInput = inputObjectType({
  name: 'weightSkusInput',
  definition(t) {
    t.decimal('minimum');
    t.decimal('maximum');
    t.int('type');
  }
});

const InventorySkusInput = inputObjectType({
  name: 'InventorySkusInput',
  definition(t) {
    t.int('id');
    t.int('stock_location_id');
    t.decimal('quantity');
    t.decimal('min_quantity');
    t.decimal('par_level');
    t.decimal('rank');
    t.boolean('inventory_tracking');
  }
});

export const InputTlUser = inputObjectType({
  name: 'InputTlUser',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('first_name');
    t.nonNull.string('last_name');
    t.nonNull.string('email');
    t.nonNull.string('password');
  }
});

export const bulkAssignTask = inputObjectType({
  name: 'bulkAssignTask',
  definition(t) {
    t.nonNull.field('taskId', {
      type: list('Int')
    });
    t.nonNull.int('tl_user_id');
  }
});

export const bulkAssignService = inputObjectType({
  name: 'bulkAssignService',
  definition(t) {
    t.nonNull.field('serviceId', {
      type: list('Int')
    });
    t.nonNull.int('tl_team_id');
  }
});

export const bulkAssignInput = inputObjectType({
  name: 'bulkAssignInput',
  definition(t) {
    t.nonNull.int('team_id');
    t.nonNull.int('service_type_id');
  }
});

export const bulkAssignAllSelectedServices = inputObjectType({
  name: 'bulkAssignAllSelectedServices',
  definition(t) {
    t.nonNull.int('id');
    t.field('type1', {
      type: 'bulkAssignInput'
    });
    t.field('type2', {
      type: 'bulkAssignInput'
    });
    t.field('type3', {
      type: 'bulkAssignInput'
    });
  }
});

export const bulkAllocateTasksUnderTeamInput = inputObjectType({
  name: 'bulkAllocateTasksUnderTeamInput',
  definition(t) {
    t.nonNull.int('tl_job_id');
    t.nonNull.int('tl_user_id');
  }
});

export const PathInput = inputObjectType({
  name: 'PathInput',
  definition(t) {
    t.nonNull.float('lat');
    t.nonNull.float('lng');
  }
});

export const ZoneInput = inputObjectType({
  name: 'ZoneInput',
  definition(t) {
    t.string('name');
    t.string('description');
    t.list.field('paths', {
      type: PathInput
    }),
      t.int('team_id');
  }
});
