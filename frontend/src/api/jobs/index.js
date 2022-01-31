import gql from 'graphql-tag';

export const getUnallocatedJobsUnderTeam = gql`
  query getUnallocatedJobsUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $td_invoice_id: Int
    $zones: String
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getUnallocatedJobsUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      zones: $zones
      b2b_delivery: $b2b_delivery
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      vehicleType {
        id
        name
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        delivery_time_from
        delivery_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;
export const getAllUnassignedRegJobsUnderMasterFranchise = gql`
  query getAllUnassignedRegJobsUnderMasterFranchise(
    $start_delivery_date: String
    $end_delivery_date: String
    $delivery_time_from: String
    $delivery_time_to: String
    $td_tenant_id: Int
    $start_collection_date: String
    $end_collection_date: String
    $collection_time_from: String
    $collection_time_to: String
    $td_invoice_id: Int
    $vehicle_type: String
    $zones: String
    $tl_service_task_type_id: Int
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllUnassignedRegJobsUnderMasterFranchise(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_tenant_id: $td_tenant_id
      start_collection_date: $start_collection_date
      end_collection_date: $end_collection_date
      collection_time_from: $collection_time_from
      collection_time_to: $collection_time_to
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      tl_service_task_type_id: $tl_service_task_type_id
      b2b_delivery: $b2b_delivery
      page: $page
      limit: $limit
    ) {
      totalItem
      zones {
        name
      }
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      vehicleType {
        id
        name
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_location
        collection_time_from
        collection_time_to
        delivery_time_from
        delivery_time_to
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;
export const getAllAssignedRegJobsUnderMasterFranchise = gql`
  query getAllAssignedRegJobsUnderMasterFranchise(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $vehicle_type: String
    $tl_service_task_type_id: Int
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllAssignedRegJobsUnderMasterFranchise(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      tl_service_task_type_id: $tl_service_task_type_id
      b2b_delivery: $b2b_delivery
      page: $page
      limit: $limit
    ) {
      totalItem
      zones {
        name
      }
      vehicleType {
        id
        name
      }
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllCompletedRegJobsUnderMasterFranchise = gql`
  query getAllCompletedRegJobsUnderMasterFranchise(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $vehicle_type: String
    $tl_service_task_type_id: Int
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllCompletedRegJobsUnderMasterFranchise(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      tl_service_task_type_id: $tl_service_task_type_id
      b2b_delivery: $b2b_delivery
      page: $page
      limit: $limit
    ) {
      totalItem
      zones {
        name
      }
      vehicleType {
        id
        name
      }
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllFailedRegJobsUnderMasterFranchise = gql`
  query getAllFailedRegJobsUnderMasterFranchise(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $vehicle_type: String
    $tl_service_task_type_id: Int
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllFailedRegJobsUnderMasterFranchise(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      tl_service_task_type_id: $tl_service_task_type_id
      b2b_delivery: $b2b_delivery
      page: $page
      limit: $limit
    ) {
      totalItem
      zones {
        name
      }
      vehicleType {
        id
        name
      }
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllocatedJobsUnderTeam = gql`
  query getAllocatedJobsUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $tl_user_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllocatedJobsUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      tl_user_id: $tl_user_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      b2b_delivery: $b2b_delivery
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllCompletedJobsUnderTeam = gql`
  query getAllCompletedJobsUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $tl_user_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllCompletedJobsUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      tl_user_id: $tl_user_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      b2b_delivery: $b2b_delivery
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllFailedJobsUnderTeam = gql`
  query getAllFailedJobsUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $tl_user_id: Int
    $delivery_window: String
    $td_invoice_id: Int
    $zones: String
    $b2b_delivery: Boolean
    $page: Int
    $limit: Int
  ) {
    getAllFailedJobsUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      tl_user_id: $tl_user_id
      delivery_window: $delivery_window
      td_invoice_id: $td_invoice_id
      b2b_delivery: $b2b_delivery
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_time_from
        collection_time_to
        collection_location
        collection_vehicle
        collection_latlng
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
          }
          latlng
        }
        TlTasks {
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;

export const getAllPackingOrdersUnderTeam = gql`
  query getAllPackingOrdersUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $status_task_id: Int
    $tl_user_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $td_invoice_id: Int
    $zones: String
    $page: Int
    $limit: Int
  ) {
    getAllPackingOrdersUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      tl_user_id: $tl_user_id
      status_task_id: $status_task_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_location
        collection_vehicle
        collection_latlng
        collection_time_from
        collection_time_to
        delivery_time_from
        delivery_time_to
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
            sku_code
            stock_location
            stock_location_id
            sku_id
            sku {
              SkuActualSkus {
                actual_sku {
                  supplier {
                    name
                  }
                }
              }
              name
              uom {
                name
              }
              product {
                name
              }
            }
            total_qty
          }
          latlng
        }
        TlTasks {
          id
          tl_task_status_id
          tl_service_task_type_id
          td_order_item_id
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;
export const getAllPackingOrdersUnderInvoice = gql`
  query getAllPackingOrdersUnderInvoice($job_id: Int) {
    getAllPackingOrdersUnderInvoice(job_id: $job_id) {
      id
      date_created
      td_tenant_id
      td_invoice_id
      td_order_id
      delivery_date
      delivery_time_from
      delivery_time_to
      master_franchise_team_id
      collection_requirement
      collection_date
      collection_time_from
      collection_time_to
      collection_location
      collection_vehicle
      collection_latlng
      vehicle_requirement
      delivery_vehicle
      storage_requirement
      delivery_address
      zones
      tenants {
        tenant {
          name
          id
        }
      }
      invoices {
        id
        OrderItem {
          id
          customer_buyer_id
          customer_seller_id
          customer {
            id
            name
          }
        }
        latlng
      }
      TlTasks {
        id
        tl_task_status_id
        tl_service_task_type_id
        td_order_item_id
        quantity
        received_quantity
        TlTaskStatuses {
          name
          id
        }
        OrderItem {
          product_name
          sku {
            product {
              name
            }
          }
        }
        TlUsers {
          id
          first_name
          last_name
        }
      }
      TlServices {
        id
        tl_service_type_id
        tl_job_id
        tl_team_id
        TlServiceType {
          id
          name
        }
        TlTeam {
          id
          name
        }
        TlTasks {
          id
          tl_service_id
          tl_task_status_id
          tl_service_task_type_id
          tl_location_id
          tl_user_id
          tl_team_id
          tl_job_id
          active
          td_order_item_id
          quantity
          td_actual_sku_id
          TlServiceTaskType {
            tl_service_type_id
            id
            name
            sync_required
          }
        }
      }
    }
  }
`;

export const getAllPickingOrdersUnderTeam = gql`
  query getAllPickingOrdersUnderTeam(
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $tl_user_id: Int
    $status_task_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $td_invoice_id: Int
    $zones: String
    $page: Int
    $limit: Int
  ) {
    getAllPickingOrdersUnderTeam(
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      tl_user_id: $tl_user_id
      status_task_id: $status_task_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      geofenceZones {
        paths
        id
        name
      }
      tenants {
        id
        first_name
        last_name
        tenant {
          name
        }
      }
      items {
        id
        date_created
        td_tenant_id
        td_invoice_id
        td_order_id
        delivery_date
        delivery_time_from
        delivery_time_to
        master_franchise_team_id
        collection_requirement
        collection_date
        collection_location
        collection_vehicle
        collection_latlng
        collection_time_from
        collection_time_to
        delivery_time_from
        delivery_time_to
        vehicle_requirement
        delivery_vehicle
        storage_requirement
        delivery_address
        zones
        tenants {
          tenant {
            name
            id
          }
        }
        invoices {
          id
          OrderItem {
            id
            customer_buyer_id
            customer_seller_id
            customer {
              id
              name
            }
            sku_code
            stock_location
            stock_location_id
            sku_id
            sku {
              SkuActualSkus {
                actual_sku {
                  supplier {
                    name
                  }
                }
              }
              name
              uom {
                name
              }
              product {
                name
              }
            }
            total_qty
          }
          latlng
        }
        TlTasks {
          id
          tl_task_status_id
          tl_service_task_type_id
          td_order_item_id
          TlUsers {
            id
            first_name
            last_name
          }
        }
        TlServices {
          id
          tl_service_type_id
          tl_job_id
          tl_team_id
          TlServiceType {
            id
            name
          }
          TlTeam {
            id
            name
          }
          TlTasks {
            id
            tl_service_id
            tl_task_status_id
            tl_service_task_type_id
            tl_location_id
            tl_user_id
            tl_team_id
            tl_job_id
            active
            td_order_item_id
            quantity
            td_actual_sku_id
            TlServiceTaskType {
              tl_service_type_id
              id
              name
              sync_required
            }
          }
        }
      }
    }
  }
`;
export const getAllPickingOrdersUnderInvoice = gql`
  query getAllPickingOrdersUnderInvoice($job_id: Int) {
    getAllPickingOrdersUnderInvoice(job_id: $job_id) {
      id
      date_created
      td_tenant_id
      td_invoice_id
      td_order_id
      delivery_date
      delivery_time_from
      delivery_time_to
      master_franchise_team_id
      collection_requirement
      collection_date
      collection_time_from
      collection_time_to
      collection_location
      collection_vehicle
      collection_latlng
      vehicle_requirement
      delivery_vehicle
      storage_requirement
      delivery_address
      zones
      tenants {
        tenant {
          name
          id
        }
      }
      invoices {
        id
        OrderItem {
          id
          customer_buyer_id
          customer_seller_id
          customer {
            id
            name
          }
        }
        latlng
      }
      TlTasks {
        id
        tl_task_status_id
        tl_service_task_type_id
        td_order_item_id
        quantity
        received_quantity
        TlTaskStatuses {
          name
          id
        }
        OrderItem {
          product_name
          sku {
            product {
              name
            }
          }
        }
        TlUsers {
          id
          first_name
          last_name
        }
      }
      TlServices {
        id
        tl_service_type_id
        tl_job_id
        tl_team_id
        TlServiceType {
          id
          name
        }
        TlTeam {
          id
          name
        }
        TlTasks {
          id
          tl_service_id
          tl_task_status_id
          tl_service_task_type_id
          tl_location_id
          tl_user_id
          tl_team_id
          tl_job_id
          active
          td_order_item_id
          quantity
          td_actual_sku_id
          TlServiceTaskType {
            tl_service_type_id
            id
            name
            sync_required
          }
        }
      }
    }
  }
`;

export const allUserDriveForTeamPreview = gql`
  query allUserDriveForTeamPreview {
    allUserDriveForTeamPreview {
      id
      first_name
      last_name
      mobile
      email
      password
      token
      tokenJWT
      dataZone {
        zone {
          id
          name
        }
        countPoint
        countInvoice
      }
    }
  }
`;

export const bulkAllocateTasksUnderTeam = gql`
  mutation bulkAllocateTasksUnderTeam($items: [bulkAllocateTasksUnderTeamInput]!) {
    bulkAllocateTasksUnderTeam(items: $items)
  }
`;
export const bulkAllocateCollectionTasksUnderTeam = gql`
  mutation bulkAllocateCollectionTasksUnderTeam($items: [bulkAllocateTasksUnderTeamInput]!) {
    bulkAllocateCollectionTasksUnderTeam(items: $items)
  }
`;
export const bulkAllocateDeliveryTasksUnderTeam = gql`
  mutation bulkAllocateDeliveryTasksUnderTeam($items: [bulkAllocateTasksUnderTeamInput]!) {
    bulkAllocateDeliveryTasksUnderTeam(items: $items)
  }
`;
export const changeB2bDeliveryJobToBackToBack = gql`
  mutation changeB2bDeliveryJobToBackToBack($job_ids: [Int]!, $type: Boolean!) {
    changeB2bDeliveryJobToBackToBack(job_ids: $job_ids, type: $type) {
      itemsSuccess {
        id
        td_invoice_id
        tenants {
          tenant {
            name
          }
        }
      }
      itemsFailed {
        id
        td_invoice_id
        tenants {
          tenant {
            name
          }
        }
      }
    }
  }
`;

export const updatePackingOrdersStatus = gql`
  mutation updatePackingOrdersStatus($job_ids: [Int]!, $status_id: Int) {
    updatePackingOrdersStatus(job_ids: $job_ids, status_id: $status_id)
  }
`;
export const updatePackingOrderStatusByTask = gql`
  mutation updatePackingOrderStatusByTask($task_ids: [Int]!, $status_id: Int) {
    updatePackingOrderStatusByTask(task_ids: $task_ids, status_id: $status_id)
  }
`;

export const updatePackingReceivedQty = gql`
  mutation updatePackingReceivedQty($tlTaskId: Int!, $newReceivedQty: Int!) {
    updatePackingReceivedQty(tlTaskId: $tlTaskId, newReceivedQty: $newReceivedQty) {
      id
    }
  }
`;

export const updatePickingOrdersStatus = gql`
  mutation updatePickingOrdersStatus($job_ids: [Int]!, $status_id: Int) {
    updatePickingOrdersStatus(job_ids: $job_ids, status_id: $status_id)
  }
`;
export const updatePickingOrderStatusByTask = gql`
  mutation updatePickingOrderStatusByTask($task_ids: [Int]!, $status_id: Int) {
    updatePickingOrderStatusByTask(task_ids: $task_ids, status_id: $status_id)
  }
`;
export const updatePickingReceivedQty = gql`
  mutation updatePickingReceivedQty($tlTaskId: Int!, $newReceivedQty: Int!) {
    updatePickingReceivedQty(tlTaskId: $tlTaskId, newReceivedQty: $newReceivedQty) {
      id
    }
  }
`;
export const allUserDriveForTeam = gql`
  query allUserDriveForTeam {
    allUserDriveForTeam {
      id
      first_name
      last_name
      mobile
      email
      password
    }
  }
`;

export const downloadPackingListPdf = gql`
  mutation downloadPackingListPdf($jsonData: String!) {
    downloadPackingListPdf(jsonData: $jsonData)
  }
`;

export const downloadPickingListPdf = gql`
  mutation downloadPickingListPdf($jsonData: String!) {
    downloadPickingListPdf(jsonData: $jsonData)
  }
`;
