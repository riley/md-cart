import { getToken, setToken, logoutToken } from '../utils/storage'

let host: string
if (window.location.host === 'mrdavis.com') {
  host = process.env.VUE_APP_PROD_HOST
} else if (window.location.host === 'staging-mrdavis.kinsta.com') {
  host = process.env.VUE_APP_STG_HOST
} else {
  host = process.env.VUE_APP_DEV_HOST
}

export default {
  namespaced: true,
  state: {
    _id: null,
    billing: {
      address: {
        name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      }
    },
    bundles: [],
    createdAt: null,
    email: '',
    fetching: false,
    fetchingUser: false,
    grandTotal: 0,
    id: null, // fetched off query param on load
    refId: '',
    orderError: null,
    orderLoadedOnce: false,
    paymentMethod: '',
    shipping: {
      address: {
        name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      intlDiscount: 0,
      modified: false,
      postage: 0,
      rates: [], // first class, priority, etc
      service: null,
    },
    status: '',
    subtotal: 0,
    totalDiscount: 0,
    totalTax: 0,
    userId: '',
    userRefId: ''
  },
  getters: {
    referDiscount (state: any) {
      return !!state.refId
    },
    discountBeforeReferralBonus (state: any) {
      const referDiscount = state.refId ? 1000 : 0
      return Math.max(state.discount - referDiscount, 0)
    }
  },
  mutations: {
    errorLoadingOrder (state: any, message: string) {
      state.orderError = message
    },
    fetchingOrder (state: any, fetching: boolean) {
      state.fetching = fetching
    },
    fetchingUser (state: any, fetching: boolean) {
      state.fetchingUser = fetching
    },
    missingIdError (state: any) {
      state.orderError = 'The order id is missing.'
    },
    setOrder (state: any, { order, token }: any) {
      setToken(token)
      state.billing.address = order.billingAddress
      state.bundles = order.bundles
      state.createdAt = new Date(order.createdAt)
      state.email = order.email
      state.grandTotal = order.totalPrice
      state.id = order.id
      state._id = order._id
      state.orderLoadedOnce = true
      state.paymentMethod = order.stripeCharge.source.brand.toLowerCase()
      state.shipping.address = order.shippingAddress
      state.shipping.postage = order.shipping.postage
      state.shipping.service = order.shipping.service
      state.refId = order.refId
      state.status = order.status
      state.subtotal = order.subtotal
      state.totalDiscount = order.totalDiscount
      state.totalTax = order.totalTax
      state.userId = order.userId
    },
    setRefId (state: any, refId: string) {
      state.refId = refId
    },
    setUserRefId (state: any, refId: string) {
      state.userRefId = refId
    }
  },
  actions: {
    async fetchOrder ({ commit, state }: Action) {
      commit('fetchingOrder', true)
      const response = await fetch(`${host}/order-thankyou`, {
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      }).then(res => res.json())
      console.log('order response', response)
      commit('fetchingOrder', false)
      if (response.order === null) {
        commit('errorLoadingOrder', `Couldn't find order: ${state.id}`)
      } else if (response.order.id) {
        commit('setOrder', response)
      } else {
        commit('errorLoadingOrder', response.message)
      }
    },
    async fetchUserMeta ({ commit, state }: Action) {
      commit('fetchingUser', true)
      const userMeta = await fetch(`${host}/user/meta`, {
        mode: 'cors',
        headers: { 'Authorization': `Bearer ${getToken()}` }
      }).then(res => res.json())
      commit('fetchingUser', false)

      console.log('userMeta', userMeta)
      if (userMeta !== null && userMeta.meta) {
        commit('setUserRefId', userMeta.refId)
      }
    }
  }
}
