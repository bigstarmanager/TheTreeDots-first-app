import gql from 'graphql-tag';

export const allUnassignedJobsUnderMasterFranchise = gql`
  query allUnassignedJobsUnderMasterFranchise(
    $userId: Int
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $td_invoice_id: Int
    $vehicle_type: String
    $zones: String
    $page: Int
    $limit: Int
  ) {
    allUnassignedJobsUnderMasterFranchise(
      userId: $userId
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      vehicleType {
        id
        name
      }
      zones {
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

export const allAssignedJobsUnderMasterFranchise = gql`
  query allAssignedJobsUnderMasterFranchise(
    $userId: Int
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $vehicle_type: String
    $td_invoice_id: Int
    $zones: String
    $page: Int
    $limit: Int
  ) {
    allAssignedJobsUnderMasterFranchise(
      userId: $userId
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      vehicleType {
        id
        name
      }
      zones {
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
        delivery_time_from
        delivery_time_to
        collection_time_from
        collection_time_to
        collection_vehicle
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

export const allCompleteJobsUnderMasterFranchise = gql`
  query allCompleteJobsUnderMasterFranchise(
    $userId: Int
    $start_delivery_date: String
    $end_delivery_date: String
    $td_tenant_id: Int
    $delivery_time_from: String
    $delivery_time_to: String
    $td_invoice_id: Int
    $vehicle_type: String
    $zones: String
    $page: Int
    $limit: Int
  ) {
    allCompleteJobsUnderMasterFranchise(
      userId: $userId
      start_delivery_date: $start_delivery_date
      end_delivery_date: $end_delivery_date
      td_tenant_id: $td_tenant_id
      delivery_time_from: $delivery_time_from
      delivery_time_to: $delivery_time_to
      td_invoice_id: $td_invoice_id
      vehicle_type: $vehicle_type
      zones: $zones
      page: $page
      limit: $limit
    ) {
      totalItem
      vehicleType {
        id
        name
      }
      zones {
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
        collection_vehicle
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

export const getAllPrimaryTeamUnderMasterFranchise = gql`
  query getAllPrimaryTeamUnderMasterFranchise {
    getAllPrimaryTeamUnderMasterFranchise {
      id
      name
    }
  }
`;

export const assignAllSelectedServices = gql`
  mutation assignAllSelectedServices($serviceID: Int, $jobID: Int, $teamID: Int) {
    assignAllSelectedServices(tl_service_type_id: $serviceID, tl_job_id: $jobID, tl_team_id: $teamID) {
      id
      tl_service_type_id
      tl_job_id
      tl_team_id
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
        #         ActualSku {

        #         }
        #         OrderItem {

        #         }
        TlServiceTaskType {
          id
          tl_service_type_id
          name
          sync_required
        }
      }
      TlServiceType {
        id
        name
      }
    }
  }
`;
export const bulkAssignAllSelectedServices = gql`
  mutation($item: [bulkAssignAllSelectedServices]!) {
    bulkAssignAllSelectedServices(item: $item)
  }
`;
export const updateB2cDeliveryJob = gql`
  mutation updateB2cDeliveryJob($job_ids: [Int]!, $type: Boolean!) {
    updateB2cDeliveryJob(job_ids: $job_ids, type: $type)
  }
`;

export const allDistinctZoneJobsUnderMasterFranchise = gql`
  query allDistinctZoneJobsUnderMasterFranchise($userId: Int) {
    allDistinctZoneJobsUnderMasterFranchise(userId: $userId)
  }
`;

export const allDistinctCollectionWindowJobsUnderMasterFranchise = gql`
  query allDistinctCollectionWindowJobsUnderMasterFranchise(
    $userId: Int
    $type: queryJobMasterFranchiseType
  ) {
    allDistinctCollectionWindowJobsUnderMasterFranchise(userId: $userId, type: $type)
  }
`;

export const allDistinctTenantJobsUnderMasterFranchise = gql`
  query allDistinctTenantJobsUnderMasterFranchise($userId: Int, $type: queryJobMasterFranchiseType) {
    allDistinctTenantJobsUnderMasterFranchise(userId: $userId, type: $type) {
      id
      tenant {
        id
        name
      }
    }
  }
`;
