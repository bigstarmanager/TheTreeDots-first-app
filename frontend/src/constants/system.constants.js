export const ROLE = {
  DRIVER: 3,
  USER: 2
};
export const ROLES = [
  { key: ROLE.DRIVER, value: 'Driver' },
  { key: ROLE.USER, value: 'User' }
];

export const USER_STATUS = {
  NO_ACTIVE: 0,
  ACTIVE: 1,
  DELETED: 2
};
export const USER_STATUS_LIST = [
  { key: USER_STATUS.NO_ACTIVE, value: 'No active', color: '' },
  { key: USER_STATUS.ACTIVE, value: 'Active', color: 'green' },
  { key: USER_STATUS.DELETED, value: 'Deleted', color: 'red' }
];

export const JOB_DETAIL_STATUS = {
  NOT_DELIVERED: 0,
  DELIVERED: 1
};
export const JOB_DETAIL_STATUS_LIST = [
  { key: JOB_DETAIL_STATUS.NOT_DELIVERED, value: 'Not Delivered', color: 'red' },
  { key: JOB_DETAIL_STATUS.DELIVERED, value: 'Delivered', color: '#108ee9' }
];

export const DISTRIBUTION_STATUS = {
  COMPLETED: 0,
  NO_STARTED: 1
};
export const DISTRIBUTION_STATUS_LIST = [
  { key: DISTRIBUTION_STATUS.COMPLETED, value: 'Completed', color: '#108ee9' },
  { key: JOB_DETAIL_STATUS.DELIVERED, value: 'Delivered', color: 'red' }
];
