const DEFAULT_STATE = {
  data: [],
  listPaths: null
};

export default {
  name: 'JobsManagementModule',
  state: DEFAULT_STATE,
  mutations: {
    setAllJobsManagement(state, data) {
      state.data = data;
    },
    clearJobsManagementState(state, data) {
      state = Object.assign(state, data);
    },
    setPathsGMap(state, data) {
      if (data) {
        state.listPaths = [];
        data.map((item) => {
          if (this.checkPaths(item.paths).check) {
            state.listPaths.push({
              ...item,
              totalItem: this.checkPaths(item.paths).totalItem,
              driverUserId: this.driverUserId
            });
          }
        });
      }
    }
  },
  getters: {
    getListPaths(state) {
      return state.listPaths;
    }
  },
  actions: {
    setAllJobsManagement({ commit }, data) {
      commit('setAllJobsManagement', data);
    },
    clearJobsManagementState({ commit }) {
      commit('clearJobsManagementState', DEFAULT_STATE);
    },
    setPathsGMap({ commit }, data) {}
  }
};
