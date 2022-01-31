import iconUser from 'assets/images/icon/icon-park-outline_people-safe.png';
import iconJob from 'assets/images/icon/icon-job.png';
import iconSetting from 'assets/images/icon/icon-setting.png';
import iconUsers from 'assets/images/icon/icon-users.png';

export const MAIN_ROUTER = [
  {
    path: 'masterFranchise',
    name: 'Master Franchise',
    title: 'Master Franchise',
    redirect: 'masterFranchise/unassigned',
    component: () => import('pages/masterFranchise/index.vue'),
    meta: {
      auth: true
    },
    children: [
      {
        path: 'unassigned',
        name: 'Master Franchise Unassigned',
        title: 'Unassigned',
        component: () => import('pages/masterFranchise/unassigned.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'assigned',
        name: 'Master Franchise Assigned',
        title: 'Assigned',
        component: () => import('pages/masterFranchise/assigned.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'completed',
        name: 'Master Franchise Completed',
        title: 'Completed',
        component: () => import('pages/masterFranchise/completed.vue'),
        meta: {
          auth: true
        }
      }
    ],
    icon: iconUser
    // order: 0,
  },
  {
    path: 'jobs',
    name: 'Jobs',
    title: 'Jobs',
    redirect: 'jobs/backToBack',
    component: () => import('pages/jobs/index.vue'),
    meta: {
      auth: true
    },
    children: [
      {
        path: 'backToBack',
        name: 'Back to back',
        title: 'Back to back',
        badge: true,
        component: () => import('pages/jobs/jobUnassigned.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'collection',
        name: 'Reg. Collection',
        title: 'Reg. Collection',
        badge: true,
        component: () => import('pages/jobs/RegCollection.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'deliveries',
        name: 'Reg. Deliveries',
        title: 'Reg. Deliveries',
        badge: true,
        component: () => import('pages/jobs/RegDeliveries.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'Packing',
        name: 'Packing',
        title: 'Packing',
        badge: true,
        component: () => import('pages/jobs/Packing.vue'),
        meta: {
          auth: true
        }
      },
      {
        path: 'picking',
        name: 'Picking',
        title: 'Picking',
        badge: true,
        component: () => import('pages/jobs/Picking.vue'),
        meta: {
          auth: true
        }
      }
    ],
    icon: iconJob,
    order: 2
  },

  // {
  //   path: '3pl',
  //   name: '3PL',
  //   title: '3PL',
  //   component: Distribution,
  //   meta: {auth: true},
  //   hide: true,
  //   order: 3,
  // },
  {
    path: 'setting',
    name: 'Setting',
    title: 'Setting',
    redirect: 'setting/geoFence',
    component: () => import('pages/setting/index.vue'),
    meta: {
      auth: true
    },
    children: [
      {
        path: 'geoFence',
        name: 'Geo-Fence',
        title: 'Geo-Fence',
        badge: true,
        component: () => import('pages/setting/geoFence.vue'),
        meta: {
          auth: true
        }
      }
    ],
    icon: iconSetting,
    order: 4
  },
  {
    path: 'users',
    name: 'Users',
    title: 'Users',
    component: () => import('pages/users/ListUser.vue'),
    meta: {
      auth: true
    },
    icon: iconUsers,
    order: 3
  }
];

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('layouts/DashboardLayout.vue'),
    redirect: 'jobs',
    meta: {
      auth: true
    },
    children: MAIN_ROUTER
  },
  {
    path: '/login',
    name: 'Login',
    meta: {
      auth: false
    },
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/login/Index.vue')
      }
    ]
  },
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  },
  {
    path: '/testButton',
    component: () => import('pages/testComponent/testButton.vue')
  }
  // {
  //   path: '/test',
  //   component: () => import('pages/test/index.vue')
  // }

  //   {
  //     path: '*',
  //     name: '404 not found',
  //     component: PageNotFound
  //   }
];

export default routes;
