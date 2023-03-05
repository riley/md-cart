import Vue from 'vue'
import Vuex from 'vuex'
import { setToken } from '../utils/storage'
import { makeFetch } from '../utils/network'
import upsells from '../utils/upsells'
import user from './user'
import order from './order'
import cart from './cart'
import vip from './vip'

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
  modules: { user, cart, order, vip },
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
    upsells,
    usernameError: null,
  },
  getters: {
    allOrders: (state: any) => {
      return state.orders.map((_id: string) => state.orderMap[_id])
    },
    allVips: (state: any) => {
      return state.vips.map((_id: string) => state.vipMap[_id])
    },
    categories: (state: any) => {
      return new Set(state.stock.map((product: Product) => product.clothingType))
    },
  },
  mutations: {
    clearLoginForm (state: any) {
      state.loginFormActive = false
    },
    setApplicationError (state: any, message: string) {
      state.applicationError = message
    },
    setFetching (state: any, fetching: boolean) {
      state.fetching = fetching
    },
    setFetchingSnooze (state: any, fetching: boolean) {
      state.fetchingSnooze = fetching
    },
    setOrders (state: any, orders: Order[]) {
      const map: OrderMap = {}

      for (const order of orders) {
        map[order._id] = order
      }

      orders.sort((a: Order, b: Order) => b.createdAt.getTime() - a.createdAt.getTime())

      state.orderMap = map
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
    setStock (state: any, stock: Product[]) {
      state.stock = stock
    },
    setVip (state: any, vip: VIP) {
      state.vipMap = { ...state.vipMap, [vip._id]: vip }
    },
    setVips (state: any, vips: VIP[]) {
      console.log('setVips root', vips)

      const map: VipMap = {}
      for (const vip of vips) {
        map[vip._id] = vip
      }

      state.vipMap = map

      state.vips = vips.map(vip => vip._id)
    },
    setUsernameError (state: any, message: string) {
      state.usernameError = message
    },
    snoozeError (state: any, message: string) {
      state.snoozeError = message
    },
    toggleLoginForm (state: any, active: boolean) {
      console.log('admin/toggleLoginForm', active)
      state.loginFormActive = active
    }
  },
  actions: {
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

        for (const order of orders) {
          order.createdAt = new Date(order.createdAt)
          if (order.estimatedDeliveryDate) {
            order.estimatedDeliveryDate = new Date(order.estimatedDeliveryDate)
          }
        }

        commit('setOrders', orders)
      } catch (e) {
        console.log('failed to fetch orders')
      }
    },
    async fetchVips ({ commit, state }: Action) {
      try {
        const vips = await makeFetch('/api/vips').then(res => res.json())

        for (const vip of vips) {
          vip.nextDelivery = new Date(vip.nextDelivery)
          vip.createdAt = new Date(vip.createdAt)
        }

        // group VIPs by status, then sory by next delivery date, then flatten
        const sortedVips = vips.reduce((acc: any, vip: VIP) => {
          acc[vip.status] = acc[vip.status] || []
          acc[vip.status].push(vip)
          return acc
        }, {})

        for (const status in sortedVips) {
          // date descending
          sortedVips[status].sort((a: VIP, b: VIP) => b.nextDelivery.getTime() - a.nextDelivery.getTime())
        }

        commit('setVips', [sortedVips['active'], sortedVips['paused'], sortedVips['stopped'], sortedVips['error']].flat().filter(x => x))
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
    }
  }
})
