import Vue from 'vue';
import Vuex from 'vuex';

// module user
import UserModule from './modules/UserModule';
import UserManagementModule from './modules/UserManagementModule';
import ServiceTypeModule from './modules/serviceTypeModule';
import JobsManagementModule from './modules/JobsManagement';
import GlobalModule from './modules/globalModule';
import masterFranchiseModule from './modules/masterFranchiseModule';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    user: UserModule,
    userManagement: UserManagementModule,
    serviceType: ServiceTypeModule,
    jobsManagement: JobsManagementModule,
    global: GlobalModule,
    masterFranchise: masterFranchiseModule
  }
});
