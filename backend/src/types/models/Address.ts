import { objectType } from 'nexus';

export const Address = objectType({
  name: 'Address',
  definition(t) {
    t.model.id();
    t.model.customer_id();
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
    t.model.address_type_id();
    t.model.active();
    t.model.is_default();
    t.field('type', {
      type: 'AddressType',
      resolve: (parent, _, context) => {
        if (!parent.address_type_id) return null;
        return context.prisma.addressType.findUnique({
          where: { id: parent.address_type_id || undefined }
        });
      }
    });
    t.field('country', {
      type: 'Country',
      resolve: (parent, _, context) => {
        if (!parent.country_id) return null;
        return context.prisma.country.findUnique({
          where: { id: parent.country_id || undefined }
        });
      }
    });
    t.field('asString1', {
      type: 'String',
      resolve: (parent, _, context) => {
        let concatAddress = '';

        let floor = null;
        if (!parent.floor_number && parent.unit) floor = parent.unit;
        else if (parent.floor_number && !parent.unit) floor = `Level ${parent.floor_number}`;
        else if (parent.floor_number && parent.unit) floor = `#${parent.floor_number}-${parent.unit}`;

        concatAddress += parent.street_number ? `${parent.street_number}, ` : '';
        concatAddress += parent.road ? `${parent.road}, ` : '';
        concatAddress += parent.building ? `${parent.building}, ` : '';
        concatAddress += floor ? `${floor}, ` : '';
        concatAddress += parent.stall ? `${parent.stall}, ` : '';
        concatAddress += parent.city ? `${parent.city}, ` : '';
        concatAddress += parent.state ? `${parent.state}, ` : '';
        concatAddress += parent.postal_code ? `${parent.postal_code}` : '';

        return concatAddress;
      }
    });
    t.field('asString2', {
      type: 'String',
      resolve: (parent, _, context) => {
        let concatAddress = '';

        concatAddress += parent.road ? `${parent.road}` : '';
        concatAddress += ` S${parent.postal_code || ''}`;

        return concatAddress;
      }
    });
  }
});

export const AddressType = objectType({
  name: 'AddressType',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.active();
  }
});

export const Country = objectType({
  name: 'Country',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.string('description');
    t.string('currency_code');
    t.string('currency_symbol');
    t.nonNull.boolean('active');
  }
});

export const GeofenceZones = objectType({
  name: 'GeofenceZones',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.paths();
    t.model.active();
    t.model.tenant_id();
  }
});
