import { enumType } from 'nexus';

export const MinMaxValue = {
  MIN_PAGE: 1,
  MAX_PAGE: 10000000,
  MIN_LIMIT: 1,
  MAX_LIMIT: 1000,
  MIN_DATE: new Date('1900-01-01'),
  MAX_DATE: new Date('9999-12-31')
};

export enum JobMasterFranchiseType {
  Unassigned = 'Unassigned',
  Assigned = 'Assigned',
  Completed = 'Completed'
}

export const queryJobMasterFranchiseType = enumType({
  name: 'queryJobMasterFranchiseType',
  members: Object.values(JobMasterFranchiseType)
});
