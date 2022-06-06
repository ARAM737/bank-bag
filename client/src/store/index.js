import { createStore } from 'vuex'

export default createStore({
  state: {
    username: localStorage.getItem('username') || '',
    userId: localStorage.getItem('userId') || '',
    token: localStorage.getItem('token') || '',
    wallet: null,
  },
  getters: {
  },
  mutations: {

  },
  actions: {
  },
  modules: {
  }
})
