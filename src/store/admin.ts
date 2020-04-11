import { getToken, setToken, logoutToken } from '../utils/storage'
import { host } from '../utils/computed'
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: { user },
  state: {
    loginEmailRequested: false,
    loginErrorMessage: '',
    loginFormActive: false,
    panels: [
      { title: 'See Upcoming Order(s)', element: '#upcoming-orders', icon: 'iconsmind-Truck' },
      { title: 'Make a New Order', element: '#send-now', icon: 'iconsmind-Full-Cart' },
      { title: 'Change Account Settings', element: '#account-settings', icon: 'iconsmind-Gear' },
      { title: 'See Past Order(s)', element: '#past-orders', icon: 'iconsmind-Bulleted-List' },
      { title: 'Change Vip Settings', element: '#vip-settings', icon: 'iconsmind-Astronaut' }
    ],
    orderMap: {},
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
    },
    vipMap: {},
    vips: [], // vips and orders are stored as a list of ids. refer to vipMap and orderMap
  },
  getters: {

  },
  mutations: {
    clearLoginForm (state: any) {
      state.loginEmailRequested = false
      state.loginFormActive = false
    },
    loginEmailRequested (state: any) {
      state.loginEmailRequested = true
    },
    setOrders (state: any, orders: Order[]) {
      for (const order of orders) {
        state.orderMap[order._id] = order
      }

      state.orders = orders.map(order => order._id)
    },
    setUser (state: any, user: StoredUser) {
      state.user._id = user._id
      state.user.email = user.username
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
    },
    toggleLoginForm (state: any, active: boolean) {
      state.loginFormActive = active
    }
  },
  actions: {
    async requestCode ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.identify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      try {
        await fetch(`${state.host}/request-login-code`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ username, brand: 'mrdavis' })
        }).then(res => {
          if (res.status !== 200) throw new Error('Login request failed to send code.')
        })
      } catch (e) {
        console.error(e)
        commit('loginFailure', 'We\'re having trouble sending your login email. Please try again in a few minutes, or contact us at <a href="mailto:support@mrdavis.com">support@mrdavis.com</a>. Sorry for the trouble.')
        return
      }

      commit('loginEmailRequested', true)
    },
    async login ({ commit, state }: Action) {

    },
    async fetchUser ({ commit, state }: Action) {
      const user = await fetch(`${host}/user`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then(res => res.json())

      commit('setUser', user)
    },
    async fetchOrders ({ commit, state }: Action) {
      const orders = await fetch(`${host}/orders`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      }).then(res => res.json())

      commit('setOrders', orders)
    },
    async fetchVips ({ commit, state }: Action) {
      const vips = await fetch(`${host}/vips`, {
        mode: 'cors',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
    },
    async updateUser ({ commit, state }: Action) {
      const user = await fetch(`${host}/user`, {
        mode: 'cors',
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
    },
    async updateVip ({ commit, state }: Action) {
      const vip = await fetch(`${host}/vip`, {
        mode: 'cors',
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`
        }
      })
    }
  }
})
