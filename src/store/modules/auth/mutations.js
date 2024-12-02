export default {
  setUser(state, payload) {
    state.token = payload.token;
    state.userId = payload.userId;
    state.didAutoLogout = false;
  },
  setAutoLogout(state) {
    state.didAutoLogout = true;
  },
  setToken(state, token) {
    state.token = token;
  },
  setUserId(state, userId) {
    state.user.id = userId;
  },

};