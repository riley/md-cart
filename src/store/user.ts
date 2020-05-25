import { getToken, setToken, logoutToken } from '../utils/storage'
import { host } from '../utils/computed'

export default {
  namespaced: true,
  state: {
    _id: null,
    billing: {
      address: null
    },
    cardMeta: null,
    credit: 0,
    refId: '',
    shipping: {
      address: null,
    },
    username: null
  },
  getters: {

  },
  mutations: {
    setUser (state: any, user: StoredUser) {
      state._id = user._id
      state.username = user.username
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
      state.cardMeta = user.cardMeta
      state.credit = user.credit
      state.refId = user.refId
    }
  },
  actions: {
    async fetchUser ({ commit }: Action) {
      const user = await fetch(`${host}/v2/user`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then(res => res.json())

      commit('setUser', user)
    },
    async updateUser () {

    }
  }
}
