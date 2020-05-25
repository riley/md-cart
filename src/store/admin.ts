import { getToken, setToken, logoutToken } from '../utils/storage'
import { host } from '../utils/computed'
import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'

Vue.use(Vuex)

type ResponseHandler = (response: Response) => Promise<any>
// this either returns the JSON promise or throws
const handleJSONResponse = ({ errorString }: {errorString: string}): ResponseHandler => {
  return function (response: Response) {
    if (response.status > 399) {
      throw new Error(`status ${response.status}: ${errorString}`)
    }

    return response.json()
  }
}

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: { user },
  state: {
    fetching: false,
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

    stock: [],
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
    // return VIPs that will be billed soon
    upcomingRebills: (state: any) => {
      const soon = new Date()
      soon.setDate(soon.getDate() + 10)
      return state.vips
        .filter((vip: VIP) => vip.nextDelivery < soon)
    },
    allOrders: (state: any) => {
      return state.orders.map((_id: string) => state.orderMap[_id])
    },
    allVips: (state: any) => {
      return state.vips.map((_id: string) => state.vipMap[_id])
    }
  },
  mutations: {
    addItem (state: any, { item, id }: { item: Item, id: string }) {
      console.log('addItem', id, state.vipMap)
      state.vipMap[id].items = [...state.vipMap[id].items, item]
    },
    clearLoginForm (state: any) {
      state.loginEmailRequested = false
      state.loginFormActive = false
    },
    loginEmailRequested (state: any) {
      state.loginEmailRequested = true
    },
    removeItem (state: any, { sku, id }: { sku: string, id: string }) {
      const index = state.vipMap[id].items.findIndex((item: Item) => item.sku === sku)
      state.vipMap[id].items.splice(index, 1)
      state.vipMap[id].items = [...state.vipMap[id].items]
    },
    setFetching (state: any, fetching: boolean) {
      state.fetching = fetching
    },
    setNextDelivery (state: any, { nextDelivery, id }: { nextDelivery: Date, id: string }) {
      state.vipMap[id].nextDelivery = nextDelivery
    },
    setOrders (state: any, orders: Order[]) {
      for (const order of orders) {
        order.createdAt = new Date(order.createdAt)
        state.orderMap[order._id] = order
      }

      state.orders = orders.map(order => order._id)
    },
    setStock (state: any, stock: Product[]) {
      state.stock = stock
    },
    setUser (state: any, user: StoredUser) {
      state.user._id = user._id
      state.user.email = user.username
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
    },
    setVips (state: any, vips: VIP[]) {
      for (const vip of vips) {
        vip.nextDelivery = new Date(vip.nextDelivery)
        vip.createdAt = new Date(vip.createdAt)
        state.vipMap[vip._id] = vip
      }

      state.vips = vips.map(vip => vip._id)
    },
    toggleLoginForm (state: any, active: boolean) {
      state.loginFormActive = active
    }
  },
  actions: {
    async fetchPricing ({ commit, state }: Action, bundle: PricingBundle) {
      const pricing = await fetch(`${host}/v2/price?bundle=${JSON.stringify(bundle)}`)
        .then(res => res.json())

      return pricing
    },
    async fetchStock ({ commit, state }: Action) {
      commit('setFetching', true)

      try {
        const stock = await fetch(`${host}/v1/products`)
          .then(handleJSONResponse({ errorString: 'failed to fetch stock' }))
        commit('setStock', stock)
      } catch (e) {
        // show an error
        commit('setGlobalError', 'Oh no! We\'re having trouble getting product informtion for this page. The site might be having trouble, try reloading the page.')
      }

      commit('setFetching', false)
    },
    async requestCode ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.identify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      try {
        await fetch(`${host}/request-login-code`, {
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
      }).then(res => res.json())

      commit('setVips', vips)
    },
    // this does not update all vips, just one at a time
    async updateVip ({ commit, state }: Action, id: string) {
      console.log('updating vip', state.vipMap, id, state.vipMap[id])
      const vip = await fetch(`${host}/vip/${id}`, {
        mode: 'cors',
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.vipMap[id])
      }).then(res => res.json())

      console.log('updated vip', vip)
    }
  }
})
