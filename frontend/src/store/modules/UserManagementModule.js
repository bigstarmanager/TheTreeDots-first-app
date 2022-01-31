const DEFAULT_STATE = {
  data: []
};

export default {
  name: 'UserManagementModule',
  state: DEFAULT_STATE,
  mutations: {
    setAllUserManagement(state, data) {
      state.data = data;
    },
    clearUserManagementState(state, data) {
      state = Object.assign(state, data);
    }
  },
  actions: {
    setAllUserManagement({ commit }, data) {
      commit('setAllUserManagement', data);
    },
    clearUserManagementState({ commit }) {
      commit('clearUserManagementState', DEFAULT_STATE);
    }
  }
};
