import { objectType } from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.model.id();
    t.model.email();
    t.model.username();
    t.model.mobile();
    t.model.first_name();
    t.model.last_name();
    t.model.gender();
    t.field('birth_date', { type: 'Date' });
    t.model.user_type_id();
    t.model.country_id();
    t.model.image();
    t.model.buyer_type();
    t.model.stripe_customer_id();
    t.model.stripe_card_id();
    t.model.tookan_fleet_id();
    t.model.active();
    t.model.date_created();
    t.field('type', {
      type: 'UserType',
      resolve: (parent, _, context) => {
        if (!parent.user_type_id) return null;
        return context.prisma.userType.findUnique({
          where: { id: parent.user_type_id }
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
    t.list.field('address', {
      type: 'Address',
      resolve: (parent, _, context) => {
        return context.prisma.address.findMany({
          where: { customer_id: parent.id, address_type_id: 3 },
          orderBy: { is_default: 'desc' }
        });
      }
    });
    t.field('tenant', {
      type: 'Tenant',
      resolve: (parent, _, context) => {
        return context.prisma.tenant.findFirst({
          where: {
            customer: {
              some: {
                userCustomers: {
                  some: {
                    user_id: parent.id
                  }
                },
                customer_type_id: 3
              }
            }
          }
        });
      }
    });
    t.string('tokenJWT');
    t.string('token');
  }
});

export const UsersTermCondition = objectType({
  name: 'UsersTermCondition',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.condition_id();
    t.model.created_at();
  }
});

export const UserCustomer = objectType({
  name: 'UserCustomer',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.customer_id();
    t.model.active();
    t.model.user();
    t.model.customer();
  }
});

export const UserHub = objectType({
  name: 'UserHub',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.hub_id();
    t.model.hub_join_date();
    t.model.tutorial_tick_status();
    t.model.user();
    t.model.hub();
  }
});

export const UserMenu = objectType({
  name: 'UserMenu',
  definition(t) {
    t.model.id();
    t.model.user_id();
    t.model.menu_id();
    t.model.view();
    t.model.add();
    t.model.edit();
    t.model.delete();
    t.model.active();
  }
});

export const UserNotification = objectType({
  name: 'UserNotification',
  definition(t) {
    t.model.id();
    t.model.sender_user_id();
    t.model.target_user_id();
    t.model.title();
    t.model.message();
    t.model.created_at();
    t.model.payload();
    t.model.read();
  }
});

export const UserSession = objectType({
  name: 'UserSession',
  definition(t) {
    t.model.id();
    t.model.token();
    t.float('latitude');
    t.float('longitude');
    t.model.origin();
    t.model.referer();
    t.model.sec_ch_ua_mobile();
    t.model.sec_ch_ua();
    t.model.user_agent();
    t.model.version();
    t.model.created_at();
    t.model.updated_at();
  }
});

export const UserType = objectType({
  name: 'UserType',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.string('description');
    t.nonNull.boolean('active');
  }
});
