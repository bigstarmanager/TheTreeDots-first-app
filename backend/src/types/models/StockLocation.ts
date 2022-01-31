import { objectType } from 'nexus';

export const StockLocation = objectType({
  name: 'StockLocation',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.alias_name();
    t.model.collection_type();
    t.model.collection_type_id();
    t.model.supplier_id();
    t.model.group();
    t.model.group_id();
    t.model.address();
    t.model.operating_hours();
    t.model.tenant_id();
    t.model.tenant();
    t.model.active();
    t.model.created_at();
    t.model.created_by();
    t.model.updated_at();
    t.model.updated_by();
  }
});

export const StockLocationAddress = objectType({
  name: 'StockLocationAddress',
  definition(t) {
    t.model.id();
    t.model.stock_location_id();
    t.model.floor_number();
    t.model.street_number();
    t.model.road();
    t.model.building();
    t.model.unit();
    t.model.stall();
    t.model.city();
    t.model.state();
    t.model.postal_code();
    t.model.latlng();
    t.model.country_id();
    t.model.country();
    t.model.address_type_id();
    t.model.address_type();
    t.model.active();
    t.model.is_default();
    t.model.created_at();
    t.model.created_by();
    t.model.updated_at();
    t.model.updated_by();
    t.model.stock_location();
  }
});

export const StockLocationOperatingHour = objectType({
  name: 'StockLocationOperatingHour',
  definition(t) {
    t.model.id();
    t.model.stock_location_id();
    t.model.day_id();
    t.model.open_hour();
    t.model.open_minute();
    t.model.close_hour();
    t.model.close_minute();
    t.model.active();
    t.model.day();
    t.model.stock_location();
  }
});
