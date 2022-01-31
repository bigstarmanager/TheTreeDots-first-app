import * as userLocal from '../../utils/user-local';

const DEFAULT_STATE = {
  user: {},
  isLogin: false
};

export default {
  name: 'UserModule',
  state: DEFAULT_STATE,
  mutations: {
    setUser(state, data) {
      state.user = data;
    },
    setIsLogin(state, data) {
      state.isLogin = data;
    },
    clearUserState(state, data) {
      state = Object.assign(state, data);
      userLocal.removeToken();
      userLocal.removeUser();
    }
  },
  actions: {
    setUser({ commit }, data) {
      commit('setUser', data);
    },
    setIsLogin({ commit }, data) {
      commit('setIsLogin', data);
    },
    clearUserState({ commit }) {
      commit('clearUserState', DEFAULT_STATE);
    }
  }
};
