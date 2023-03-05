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
    discount: 0,
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
    logout (state: any) {
      state._id = null
      state.billing = {
        address: {
          name: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          zip: '',
          country: 'US'
        }
      }
      state.bundles = []
      state.createdAt = null
      state.discount = 0
      state.email = ''
      state.estimatedDeliveryDate = null
      state.fetching = false
      state.fetchingUser = false
      state.grandTotal = 0
      state.id = null
      state.orderError = null
      state.orderLoadedOnce = false
      state.paymentMethod = ''
      state.paypalOrderId = null
      state.refId = ''
      state.referralError = ''
      state.shipping = {
        address: {
          name: '',
          address_1: '',
          address_2: '',
          city: '',
          state: '',
          zip: '',
          country: 'US'
        }
      }
      state.status = ''
      state.subtotal = 0
      state.totalDiscount = 0
      state.totalTax = 0
      state.userId = ''
      state.userRefId = ''
    },
    missingIdError (state: any) {
      state.orderError = 'The order id is missing.'
    },
    setOrder (state: any, order: Order) {
      state.billing.address = order.billingAddress
      state.bundles = order.bundles
      state.createdAt = order.createdAt
      state.email = order.email
      if (order.estimatedDeliveryDate) {
        state.estimatedDeliveryDate = order.estimatedDeliveryDate
      }
      state.grandTotal = order.totalPrice
      state.id = order.id
      console.log('setting order _id to', order._id)
      state._id = order._id
      state.orderLoadedOnce = true
      state.paypalOrderId = order.paypalOrderId

      let paymentMethod
      if (order.stripeCharge) {
        paymentMethod = order.stripeCharge.source?.brand?.toLowerCase()
      } else if (order.paypalOrderId) {
        paymentMethod = 'paypal'
      } else {
        paymentMethod = 'free'
      }

      state.paymentMethod = paymentMethod
      state.refId = order.refId
      state.shipping.address = order.shippingAddress
      state.shipping.postage = order.shipping.postage
      state.shipping.service = order.shipping.service
      state.discount = order.bundles[0].discount
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
        setToken(response.token)
        commit('setOrder', response.order)
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
    },
    async getTracking ({ commit, state }: Action, id: string) {
      commit('fetchingTracking', true)
      const response = await makeFetch(`/api/order/${id}/tracking`).then(res => res.json())
      commit('fetchingTracking', false)

      if (response.trackingInfo) {
        // add it to the order object in the orderMap?
      }
    }
  }
}
