import Vue from 'vue'
import Vuex from 'vuex'
import { setToken, logoutToken } from '../utils/storage'
import { makeFetch } from '../utils/network'
import user from './user'

Vue.use(Vuex)

const urlParams = new URLSearchParams(location.search)
if (urlParams.get('token') != null) { // might be signed in from a snooze email
  // @ts-ignore
  setToken(urlParams.get('token'))
}

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
    applicationError: null,
    fetching: false,
    fetchingSnooze: false,
    loginFormActive: false,
    orderMap: {},
    orders: [],
    paymentError: null,
    shippingError: null,
    snoozeError: null,
    snoozedVIP: null,
    stock: [],
    vipMap: {},
    vips: [], // vips and orders are stored as a list of ids. refer to vipMap and orderMap
  },
  getters: {
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
      state.loginFormActive = false
    },
    removeItem (state: any, { sku, id }: { sku: string, id: string }) {
      const index = state.vipMap[id].items.findIndex((item: Item) => item.sku === sku)
      state.vipMap[id].items.splice(index, 1)
      state.vipMap[id].items = [...state.vipMap[id].items]
    },
    setApplicationError (state: any, message: string) {
      state.applicationError = message
    },
    setCycleDays (state: any, { cycleDays, id }: { cycleDays: number, id: string }) {
      state.vipMap[id].cycleDays = cycleDays
    },
    setFetching (state: any, fetching: boolean) {
      state.fetching = fetching
    },
    setFetchingSnooze (state: any, fetching: boolean) {
      state.fetchingSnooze = fetching
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
    setPaymentError (state: any, error: string) {
      state.paymentError = error
      window.woopra?.track('cart-js-error', `failed to update admin payment info ${error}`)
    },
    setShippingUpdateError (state: any, error: string) {
      state.shippingError = error
      window.woopra?.track('cart-js-error', `failed to update shipping in admin ${error}`)
    },
    setSnoozedVIP (state: any, vip: VIP) {
      vip.nextDelivery = new Date(vip.nextDelivery)
      state.snoozedVIP = vip
    },
    setStatus (state: any, { status, id }: { status: string, id: string }) {
      state.vipMap[id].status = status
    },
    setStock (state: any, stock: Product[]) {
      state.stock = stock
    },
    setVip: (state: any, vip: VIP) => {
      const index = state.vips.firstIndex((v: VIP) => v._id === vip._id)
      state.vips = [...state.vips.slice(0, index), vip, ...state.vips.slice(index + 1)]
    },
    setVips (state: any, vips: VIP[]) {
      const map: VipMap = {}
      for (const vip of vips) {
        vip.nextDelivery = new Date(vip.nextDelivery)
        vip.createdAt = new Date(vip.createdAt)
        map[vip._id] = vip
      }

      state.vipMap = map

      state.vips = vips.map(vip => vip._id)
    },
    snoozeError (state: any, message: string) {
      state.snoozeError = message
    },
    toggleLoginForm (state: any, active: boolean) {
      state.loginFormActive = active
    }
  },
  actions: {
    async fetchPricing ({ commit, state }: Action, bundle: PricingBundle) {
      const pricing = await makeFetch('/api/pricing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bundle })
      }).then(res => res.json())

      return pricing
    },
    async fetchStock ({ commit, state }: Action) {
      commit('setFetching', true)

      try {
        const stock = await makeFetch('/api/products')
          .then(handleJSONResponse({ errorString: 'failed to fetch stock' }))
        commit('setStock', stock)
      } catch (e) {
        // show an error
        commit('setApplicationError', 'Oh no! We\'re having trouble getting product informtion for this page. The site might be having trouble, try reloading the page.')
      }

      commit('setFetching', false)
    },
    async fetchOrders ({ commit, state }: Action) {
      try {
        const orders = await makeFetch('/api/orders').then(res => res.json())

        commit('setOrders', orders)
      } catch (e) {
        console.log('failed to fetch orders')
      }
    },
    async fetchVips ({ commit, state }: Action) {
      try {
        const vips = await makeFetch('/api/vips').then(res => res.json())

        commit('setVips', vips)
      } catch (e) {
        console.log('failed to fetch vips')
      }
    },
    // snooze a vip by clicking in the admin
    async snoozeVip ({ commit, state }: Action, id: string) {
      const vip = await makeFetch(`/api/snooze/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then(res => res.json())

      commit('setSnoozedVIP', vip)
    },
    // user has come from an email and is snoozing from the hash
    async snoozeByHash ({ commit, state }: Action, hash: string) {
      commit('setFetchingSnooze', true)

      const info = await makeFetch(`/api/snooze/${hash}`, {
        method: 'PUT'
      }).then(res => res.json())

      commit('setFetchingSnooze', false)

      if (typeof info.message === 'string') {
        return commit('snoozeError', info.message)
      }

      commit('setSnoozedVIP', info)
    },
    // this does not update all vips, just one at a time
    async updateVip ({ commit, state }: Action, id: string) {
      console.log('updating vip', state.vipMap, id, state.vipMap[id])
      const vip = await makeFetch(`/api/vip/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(state.vipMap[id])
      }).then(res => res.json())

      console.log('updated vip', vip)
      commit('setVip', vip)
    }
  }
})
