import { getToken, setToken, logoutToken } from '../utils/storage'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: {
    vips: [],
    orders: [],
    user: {
      _id: null,
      username: null,
      billing: {
        address: null,
      },
      shipping: {
        address: null
      }
    }
  },
  getters: {

  },
  mutations: {
    setUser (state: any, user: StoredUser) {
      state.user._id = user._id
      state.user.email = user.username
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
    }
  },
  actions: {
    async fetchUser ({ commit, state }: Action) {
      const user = await fetch(`${state.host}/user`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then(res => res.json())

      commit('setUser', user)
    },
    async fetchOrders ({ commit, state }: Action) {
      const orders = await fetch(`${state.host}/orders`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then(res => res.json())
    },
    async fetchVips ({ commit, state }: Action) {

    },
    async updateUser ({ commit, state }: Action) {

    },
    async updateVip ({ commit, state }: Action) {

    }
  }
})
