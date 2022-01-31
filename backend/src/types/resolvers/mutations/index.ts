import { updateZone } from './updateZone';
import { addNewZone } from './addNewZone';
import { addNewUser } from './addNewUser';
import { updateUserById } from './updateUserById';
import { deleteUser } from './deleteUser';
import { signIn } from './signIn';
import { updateTask } from './updateTask';
import { deleteTask } from './deleteTask';
import { updateTeamAndUserIdInTask } from './updateTeamAndUserIdInTask';
import { bulkAssignTask } from './bulkAssignTask';
import { bulkAssignService } from './bulkAssignService';
import { assignAllSelectedServices } from './assignAllSelectedServices';
import { bulkAssignAllSelectedServices } from './bulkAssignAllSelectedServices';
import { updateAllSelectedCollectionService } from './updateAllSelectedCollectionService';
import { bulkAllocateCollectionTasksUnderTeam } from './bulkAllocateCollectionTasksUnderTeam';
import { bulkAllocateDeliveryTasksUnderTeam } from './bulkAllocateDeliveryTasksUnderTeam';
import { bulkAllocateTasksUnderTeam } from './bulkAllocateTasksUnderTeam';
import { updateB2bDeliveryJob } from './updateB2bDeliveryJob';
import { changeB2bDeliveryJobToBackToBack } from './changeB2bDeliveryJobToBackToBack';
import { updatePackingOrderStatusByTask } from './updatePackingOrderStatusByTask';
import { updatePackingOrdersStatus } from './updatePackingOrdersStatus';
import { updatePickingOrdersStatus } from './updatePickingOrdersStatus';
import { updatePickingOrderStatusByTask } from './updatePickingOrderStatusByTask';
import { deleteZone } from './deleteZone';
import { updatePackingReceivedQty } from './updatePackingReceivedQty';
import { updatePickingReceivedQty } from './updatePickingReceivedQty';
import { changePasswordUser } from './changePasswordUser';
import { downloadPackingListPdf, downloadPickingListPdf } from './downloadPdf';

export const mutations = {
  addNewUser,
  assignAllSelectedServices,
  bulkAssignAllSelectedServices,
  bulkAllocateCollectionTasksUnderTeam,
  bulkAllocateDeliveryTasksUnderTeam,
  bulkAllocateTasksUnderTeam,
  bulkAssignTask,
  bulkAssignService,
  deleteTask,
  deleteUser,
  deleteZone,
  signIn,
  updateTask,
  updateUserById,
  updateAllSelectedCollectionService,
  updateB2bDeliveryJob,
  updatePackingOrdersStatus,
  updatePackingOrderStatusByTask,
  updatePickingOrdersStatus,
  updatePickingOrderStatusByTask,
  updateTeamAndUserIdInTask,
  changeB2bDeliveryJobToBackToBack,
  addNewZone,
  updateZone,
  updatePackingReceivedQty,
  updatePickingReceivedQty,
  changePasswordUser,
  downloadPackingListPdf,
  downloadPickingListPdf
};
