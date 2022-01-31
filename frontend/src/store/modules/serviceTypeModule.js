const DEFAULT_STATE = {
  allServiceType: [],
  allServiceTaskType: []
};

export default {
  name: 'ServiceTypeModule',
  state: DEFAULT_STATE,
  mutations: {
    setAllServiceTaskType(state, data) {
      state.allServiceTaskType = data;
    },
    setAllServiceType(state, data) {
      state.allServiceType = data;
    },
    clearServiceTypeState(state, data) {
      state = Object.assign(state, data);
    }
  },
  actions: {
    setAllServiceTaskType({ commit }, data) {
      commit('setAllServiceTaskType', data);
    },
    setAllServiceType({ commit }, data) {
      commit('setAllServiceType', data);
    },
    clearServiceTypeState({ commit }) {
      commit('clearServiceTypeState', DEFAULT_STATE);
    }
  }
};
