import { setToken } from '../utils/storage'
import { makeFetch } from '../utils/network'

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
    estimatedDeliveryDate: null,
    fetching: false,
    fetchingUser: false,
    grandTotal: 0,
    id: null, // fetched off query param on load
    orderError: null,
    orderLoadedOnce: false,
    paymentMethod: '',
    paypalOrderId: null,
    refId: '',
    referralError: '',
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
      // an order SHOULD only have a refId if there was a referral
      const referDiscount = state.refId ? 1000 : 0
      return Math.max(state.totalDiscount - referDiscount, 0)
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
      if (order.estimatedDeliveryDate) {
        state.estimatedDeliveryDate = new Date(order.estimatedDeliveryDate)
      }
      state.grandTotal = order.totalPrice
      state.id = order.id
      state._id = order._id
      state.orderLoadedOnce = true
      state.paypalOrderId = order.paypalOrderId

      let paymentMethod
      if (order.stripeCharge) {
        paymentMethod = order.stripeCharge.source.brand.toLowerCase()
      } else if (order.paypalOrderId) {
        paymentMethod = 'paypal'
      } else {
        paymentMethod = 'free'
      }

      state.paymentMethod = paymentMethod
      state.refId = order.refId
      state.referralError = order.referralError
      state.shipping.address = order.shippingAddress
      state.shipping.postage = order.shipping.postage
      state.shipping.service = order.shipping.service
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
      const response = await makeFetch('/api/order-thankyou').then(res => res.json())
      commit('fetchingOrder', false)
      if (!response.order) {
        commit('errorLoadingOrder', `Couldn't find order: ${state.id}`)
      } else if (response.order.id) {
        commit('setOrder', response)
      } else {
        commit('errorLoadingOrder', response.message)
      }
    },
    async fetchUserMeta ({ commit, state }: Action) {
      commit('fetchingUser', true)
      const userMeta = await makeFetch('/api/user/meta').then(res => res.json())
      commit('fetchingUser', false)

      if (userMeta !== null && userMeta.meta) {
        commit('setUserRefId', userMeta.refId)
      }
    }
  }
}
