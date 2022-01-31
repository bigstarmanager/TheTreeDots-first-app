import { objectType, extendType, inputObjectType } from 'nexus';

export const TlRequests = objectType({
  name: 'TlRequests',
  definition(t) {
    t.model.id();
    t.string('date_created');
    t.model.td_tenant_id();
  }
});

export const TlRequestDetials = objectType({
  name: 'TlRequestDetails',
  definition(t) {
    t.model.id();
    t.model.tl_job_id();
    t.model.request_id();
  }
});

export const ExtendedJob = extendType({
  type: 'TlJobs',
  definition(t) {
    t.list.string('ids');
  }
});

export const TlJobs = objectType({
  name: 'TlJobs',
  definition(t) {
    t.model.id();
    t.model.date_created();
    t.model.td_tenant_id();
    t.model.td_invoice_id();
    t.model.td_order_id();
    t.model.delivery_date();
    t.model.master_franchise_team_id();
    t.model.collection_requirement();
    t.model.collection_date();
    t.model.collection_location();
    t.model.collection_vehicle();
    t.field('collection_latlng', { type: 'JSON' });
    t.model.vehicle_requirement();
    t.model.delivery_vehicle();
    t.model.storage_requirement();
    t.model.delivery_address();
    t.model.delivery_time_from();
    t.model.delivery_time_to();
    t.model.collection_time_from();
    t.model.collection_time_to();
    t.model.zones();
    t.model.TlServices();
    t.list.field('TlTasks', {
      type: 'TlTasks'
    });
    t.model.invoices();
    t.model.orders();
    t.model.tenants();
    t.model.b2b_delivery();
  }
});

export const TlJobsGroup = objectType({
  name: 'TlJobsGroup',
  definition(t) {
    t.list.string('ids');
    t.list.string('invoices_id');
    t.list.string('zones');
    t.string('td_tenant_id');
    t.string('delivery_date');
    t.string('delivery_window');
    t.string('vehicle_requirement');
    t.string('supplier_name');
    t.float('amount');
    t.float('qty');
    t.list.field('TlServices', {
      type: 'TlServices'
    });
  }
});

export const TlJobList = objectType({
  name: 'TlJobList',
  definition(t) {
    t.int('totalItem');
    t.int('teamId');
    t.list.field('items', {
      type: 'TlJobs'
    });
    t.list.field('geofenceZones', {
      type: 'TlZones',
      resolve: (parent, _, context) => {
        return context.prisma.tlZones.findMany({});
      }
    });
    t.list.field('tenants', {
      type: 'Tenant',
      resolve: (parent, _, context) => {
        return context.prisma.tenant.findMany({});
      }
    });
    t.list.field('vehicleType', {
      type: 'TlVehicleTypes',
      resolve: (parent, _, context) => {
        return context.prisma.tlVehicleTypes.findMany({});
      }
    });
    t.list.field('zones', {
      type: 'TlZones',
      resolve: (parent, _, context) => {
        return context.prisma.tlZones.findMany({
          where: {
            team_id: parent.teamId
          }
        });
      }
    });
  }
});

export const TlJobListResult = objectType({
  name: 'TlJobListResult',
  definition(t) {
    t.list.field('itemsSuccess', {
      type: 'TlJobs'
    });
    t.list.field('itemsFailed', {
      type: 'TlJobs'
    });
  }
});

export const TlJobsCollection = objectType({
  name: 'TlJobsCollection',
  definition(t) {
    t.string('collection_location');
    t.int('td_tenant_id');
    t.string('collection_window');
    t.string('collection_date');
    t.list.field('jobs', {
      type: 'TlJobs'
    });
  }
});

export const TlJobsData = objectType({
  name: 'TlJobsData',
  definition(t) {
    t.string('date_created');
    t.list.field('jobs', {
      type: 'TlJobsGroup'
    });
  }
});

export const TlServices = objectType({
  name: 'TlServices',
  definition(t) {
    t.model.id();
    t.model.tl_service_type_id();
    t.model.tl_job_id();
    t.model.tl_team_id();
    t.model.TlTasks();
    t.model.TlServiceType();
    t.model.TlTeam();
  }
});

export const TlServiceType = objectType({
  name: 'TlServiceType',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlZones = objectType({
  name: 'TlZones',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.description();
    t.model.paths();
    t.model.team_id();
  }
});

export const TlServiceTaskType = objectType({
  name: 'TlServiceTaskType',
  definition(t) {
    t.model.id();
    t.model.tl_service_type_id();
    t.model.name();
    t.model.sync_required();
  }
});

export const TlOrderItemPackages = objectType({
  name: 'TlOrderItemPackages',
  definition(t) {
    t.model.id();
    t.model.order_item_id(); //foreign key: order_items
    t.model.package_id();
    t.model.quantity();
    t.model.td_location_id();
    t.model.td_lot_id();
    t.model.td_actual_sku_id(); //foreign key: actual_skus
  }
});

export const TlTasks = objectType({
  name: 'TlTasks',
  definition(t) {
    t.model.id();
    t.model.tl_service_id();
    t.model.tl_task_status_id();
    t.model.tl_service_task_type_id();
    t.model.tl_location_id();
    t.model.tl_user_id();
    t.model.tl_team_id();
    t.model.tl_job_id();
    t.model.active();
    t.model.td_order_item_id(); //no datatype specified
    t.model.quantity(); //no datatype specified
    t.model.td_actual_sku_id(); //no datatype specified
    t.model.ActualSku();
    t.model.OrderItem();
    t.model.TlServiceTaskType();
    t.model.TlUsers();
    t.model.received_quantity();
    t.model.TlTaskStatuses();
  }
});

export const TlTaskDetails = objectType({
  name: 'TlTaskDetails',
  definition(t) {
    t.model.id();
    t.model.td_invoice_id();
    t.model.tl_task_id(); //foreign key: tl_task(s)
    t.model.active();
  }
});

export const TlTaskStatuses = objectType({
  name: 'TlTaskStatuses',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlTaskHistory = objectType({
  name: 'TlTaskHistory',
  definition(t) {
    t.model.id();
    t.model.tl_task_id(); //foreign key: tl_task
    t.model.tl_user_id();
  }
});

export const TlLocations = objectType({
  name: 'TlLocations',
  definition(t) {
    t.model.id();
    t.model.name();
    t.model.address();
  }
});

export const TlLocationTypes = objectType({
  name: 'TlLocationTypes',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlTeamLocations = objectType({
  name: 'TlTeamLocations',
  definition(t) {
    t.model.id();
    t.model.tl_team_id(); //foreign key: tl_teams
    t.model.tl_location_id(); //foreign key: tl_location (s)
  }
});

export const TlLocationLocationTypes = objectType({
  name: 'TlLocationLocationTypes',
  definition(t) {
    t.model.id();
    t.model.tl_location_id(); //foreign key: tl_locations
    t.model.tl_location_type_id(); //foreign key: tl_location_type(s)
  }
});

export const TlVehicleTypes = objectType({
  name: 'TlVehicleTypes',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlLocationVehicleTypes = objectType({
  name: 'TlLocationVehicleTypes',
  definition(t) {
    t.model.id();
    t.model.tl_location_id(); //foreign key: tl_locations
    t.model.tl_vehicle_type_id(); //foreign key: tl_vehicle_type
  }
});

export const TlRoles = objectType({
  name: 'TlRoles',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlUsers = objectType({
  name: 'TlUsers',
  definition(t) {
    t.model.id();
    t.model.first_name();
    t.model.last_name();
    t.model.mobile();
    t.model.email();
    t.model.password();
    t.model.country_id();
    t.model.active();
    t.model.fleet_id();
    t.model.soft_delete();
    t.model.image();
    t.string('token');
    t.string('tokenJWT');
    t.model.TlTeamUsers();
    t.model.TlTeamUserAccess();
  }
});

export const TlUsersExtends = extendType({
  type: 'TlUsers',
  definition(t) {
    t.list.field('dataZone', {
      type: 'Polygon'
    });
  }
});

export const Polygon = objectType({
  name: 'Polygon',
  definition(t) {
    t.field('zone', {
      type: 'TlZones'
    });
    t.int('countPoint');
    t.int('countInvoice');
  }
});

export const TlTeam = objectType({
  name: 'TlTeam',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlTeamRelation = objectType({
  name: 'TlTeamRelation',
  definition(t) {
    t.model.id();
    t.model.tl_team_type_id();
    t.model.parent_team_id();
    t.model.tl_team_id();
    t.model.TlTeam();
  }
});

export const TlTeamType = objectType({
  name: 'TlTeamType',
  definition(t) {
    t.model.id();
    t.model.name();
  }
});

export const TlTeamUsers = objectType({
  name: 'TlTeamUsers',
  definition(t) {
    t.model.id();
    t.model.tl_user_id();
    t.model.tl_team_id();
    t.model.TlTeam();
  }
});

export const TlTeamUserAccess = objectType({
  name: 'TlTeamUserAccess',
  definition(t) {
    t.model.id();
    t.model.tl_role_id();
    t.model.tl_user_id();
    t.model.TlRoles();
  }
});
