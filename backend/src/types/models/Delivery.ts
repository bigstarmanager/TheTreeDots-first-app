import { objectType } from 'nexus';

export const Day = objectType({
  name: 'Day',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const DeliveryDay = objectType({
  name: 'DeliveryDay',
  definition(t) {
    t.model.id();
    t.model.customer_id();
    t.model.day_id();
  }
});

export const DeliveryProof = objectType({
  name: 'DeliveryProof',
  definition(t) {
    t.model.id();
    t.model.invoice_id();
    t.model.type();
    t.model.image();
    t.model.created_at();
    t.model.active();
  }
});

export const DeliveryStatus = objectType({
  name: 'DeliveryStatus',
  definition(t) {
    t.model.id();
    t.model.order_item_id();
    t.model.status();
    t.model.note();
    t.model.created_at();
    t.model.updated_at();
  }
});

export const DeliveryTime = objectType({
  name: 'DeliveryTime',
  definition(t) {
    t.model.id();
    t.model.start();
    t.model.end();
    t.model.description();
    t.model.default();
    t.model.created_at();
    t.model.updated_at();
    t.model.active();
  }
});

export const Hour = objectType({
  name: 'Hour',
  definition(t) {
    t.model.id();
    t.model.customer_id();
    t.model.day_id();
    t.model.open_hour();
    t.model.open_minute();
    t.model.close_hour();
    t.model.close_minute();
    t.model.active();
  }
});

export const SellerDriver = objectType({
  name: 'SellerDriver',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.temporary_user_id();
    t.model.temporary_user_expired_at();
    t.model.active();
  }
});

export const TookanTask = objectType({
  name: 'TookanTask',
  definition(t) {
    t.nonNull.field('delivey_date', { type: 'Date' });
    t.model.group_id();
    t.model.tenant_id();
    t.model.driver();
    t.model.receiver();
    t.model.task_type();
    t.model.job_id();
    t.model.created_at();
    t.model.created_by();
    t.model.updated_at();
    t.model.last_user_id();
  }
});

export const Zone = objectType({
  name: 'Zone',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const ZoneDriver = objectType({
  name: 'ZoneDriver',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.temporary_user_id();
    t.model.temporary_user_expired_at();
    t.model.active();
  }
});

export const ZoneTest = objectType({
  name: 'ZoneTest',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
    t.model.tenant_id();
  }
});

export const ZoneDriverTest = objectType({
  name: 'ZoneDriverTest',
  definition(t) {
    t.model.id();
    t.model.zone_id();
    t.model.user_id();
    t.model.temporary_user_id();
    t.model.temporary_user_expired_at();
    t.model.active();
    t.model.tenant_id();
  }
});

export const VDeliveryDays = objectType({
  name: 'VDeliveryDays',
  definition(t) {
    t.int('id');
    t.int('customer_id');
    t.int('day_id');
    t.int('tenant_id');
    t.string('name');
    t.string('day');
  }
});
