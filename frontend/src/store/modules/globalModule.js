const DEFAULT_STATE = {
  pageLoading: false
};

export default {
  name: 'globalModule',
  state: DEFAULT_STATE,
  mutations: {
    setPageLoading(state, data) {
      state.pageLoading = data;
    },
    clearGlobalState(state, data) {
      state = Object.assign(state, data);
    }
  },
  actions: {
    setPageLoading({ commit }, data) {
      commit('setPageLoading', data);
    },
    clearGlobalState({ commit }) {
      commit('clearGlobalState', DEFAULT_STATE);
    }
  }
};
