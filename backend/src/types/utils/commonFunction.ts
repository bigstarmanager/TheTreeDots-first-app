import { JobMasterFranchiseType } from './constant';

export function getDistinctJobMasterFranchiseWhere(tl_team_id = 0, type = null) {
  const COMPLETE_TASK_STATUS_ID = 4;
  const where = {
    master_franchise_team_id: tl_team_id
  };
  if (type === JobMasterFranchiseType.Unassigned) {
    where['TlServices'] = {
      some: {
        tl_service_type_id: { in: [3, 4] },
        tl_team_id: null
      }
    };
  } else if (type === JobMasterFranchiseType.Assigned) {
    where['TlServices'] = {
      some: {
        tl_service_type_id: { in: [3, 4] }
      },
      every: {
        tl_team_id: {
          not: null
        }
      }
    };
  } else if (type === JobMasterFranchiseType.Completed) {
    where['TlServices'] = {
      some: {
        tl_service_type_id: { in: [3, 4] }
      },
      every: {
        tl_team_id: {
          not: null
        }
      }
    };
    where['TlTasks'] = {
      every: {
        tl_task_status_id: COMPLETE_TASK_STATUS_ID
      }
    };
  }
  return where;
}
