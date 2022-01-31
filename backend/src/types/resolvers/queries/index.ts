import { getAllFailedRegJobsUnderMasterFranchise } from './getAllFailedRegJobsUnderMasterFranchise';
import { getAllCompletedRegJobsUnderMasterFranchise } from './getAllCompletedRegJobsUnderMasterFranchise';
import { getAllFailedJobsUnderTeam } from './getAllFailedJobsUnderTeam';
import { getAllCompletedJobsUnderTeam } from './getAllCompletedJobsUnderTeam';
import { allServiceTaskType } from './allServiceTaskType';
import { allServiceType } from './allServiceType';
import { getOneUser } from './getOneUser';
import { allUnassignedJobsUnderMasterFranchise } from './allUnassignedJobsUnderMasterFranchise';
import { allAssignedJobsUnderMasterFranchise } from './allAssignedJobsUnderMasterFranchise';
import { allCompleteJobsUnderMasterFranchise } from './allCompleteJobsUnderMasterFranchise';
import { allDistinctZoneJobsUnderMasterFranchise } from './allDistinctZoneJobsUnderMasterFranchise';
import { allDistinctCollectionWindowJobsUnderMasterFranchise } from './allDistinctCollectionWindowJobsUnderMasterFranchise';
import { allDistinctDeliveryWindowJobsUnderMasterFranchise } from './allDistinctDeliveryWindowJobsUnderMasterFranchise';
import { allDistinctTenantJobsUnderMasterFranchise } from './allDistinctTenantJobsUnderMasterFranchise';
import { allUser } from './allUser';
import { allServicesUnderTeam } from './allServicesUnderTeam';
import { allUsersUnderTeam } from './allUsersUnderTeam';
import { allDriverUnderTeam } from './allDriverUnderTeam';
import { getAllPrimaryTeamUnderMasterFranchise } from './getAllPrimaryTeamUnderMasterFranchise';
import { allLocationUnderTeam } from './allLocationUnderTeam';
import { allSecondaryTeamUnderPrimaryTeam } from './allSecondaryTeamUnderPrimaryTeam';
import { allActiveCollectionJobsUnderPrimaryTeam } from './allActiveCollectionJobsUnderPrimaryTeam';
import { getUnallocatedJobsUnderTeam } from './getUnallocatedJobsUnderTeam';
import { getAllocatedJobsUnderTeam } from './getAllocatedJobsUnderTeam';
import { allUserDriveForTeam } from './allUserDriveForTeam';
import { allUserDriveForTeamPreview } from './allUserDriveForTeamPreview';
import { getAllUnassignedRegJobsUnderMasterFranchise } from './getAllUnassignedRegJobsUnderMasterFranchise';
import { getAllAssignedRegJobsUnderMasterFranchise } from './getAllAssignedRegJobsUnderMasterFranchise';
import { getAllPackingOrdersUnderTeam } from './getAllPackingOrdersUnderTeam';
import { getAllPackingOrdersUnderInvoice } from './getAllPackingOrdersUnderInvoice';
import { getAllPickingOrdersUnderTeam } from './getAllPickingOrdersUnderTeam';
import { getAllPickingOrdersUnderInvoice } from './getAllPickingOrdersUnderInvoice';
import { getAllZonesByTeamId } from './getAllZonesByTeamId';
import { getUserDetail } from './getUserDetail';
import { getListUsers } from './getListUsers';

export const queries = {
  allServiceTaskType,
  allServiceType,
  getOneUser,
  allDriverUnderTeam,
  allUnassignedJobsUnderMasterFranchise,
  allUserDriveForTeam,
  allUserDriveForTeamPreview,
  allAssignedJobsUnderMasterFranchise,
  allCompleteJobsUnderMasterFranchise,
  allDistinctZoneJobsUnderMasterFranchise,
  allDistinctCollectionWindowJobsUnderMasterFranchise,
  allDistinctDeliveryWindowJobsUnderMasterFranchise,
  allDistinctTenantJobsUnderMasterFranchise,
  allUser,
  allServicesUnderTeam,
  allUsersUnderTeam,
  getAllPrimaryTeamUnderMasterFranchise,
  allLocationUnderTeam,
  allSecondaryTeamUnderPrimaryTeam,
  allActiveCollectionJobsUnderPrimaryTeam,
  getUnallocatedJobsUnderTeam,
  getAllocatedJobsUnderTeam,
  getAllUnassignedRegJobsUnderMasterFranchise,
  getAllAssignedRegJobsUnderMasterFranchise,
  getAllPackingOrdersUnderTeam,
  getAllPackingOrdersUnderInvoice,
  getAllPickingOrdersUnderTeam,
  getAllPickingOrdersUnderInvoice,
  getAllZonesByTeamId,
  getAllCompletedJobsUnderTeam,
  getAllFailedJobsUnderTeam,
  getAllCompletedRegJobsUnderMasterFranchise,
  getAllFailedRegJobsUnderMasterFranchise,
  getUserDetail,
  getListUsers
};
