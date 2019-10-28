let host: string
if (window.location.host === 'mrdavis.com') {
  host = process.env.VUE_APP_PROD_HOST
} else if (window.location.host === 'staging-mrdavis.kinsta.com') {
  host = process.env.VUE_APP_STG_HOST
} else {
  host = process.env.VUE_APP_DEV_HOST
}

let orderId = null
if (typeof window.URLSearchParams !== 'undefined') {
  const searchParams = new URLSearchParams(location.search)
  orderId = searchParams.get('order')
} else {
  alert('Please view this page in a more recent browser. Thank you!')
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
    id: orderId, // fetched off query param on load
    refId: '',
    orderError: null,
    orderLoadedOnce: false,
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
    totalPrice: 0,
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
    setOrder (state: any, order: any) {
      console.log('we got the order', order)
      state.billing.address = order.billingAddress
      state.bundles = order.bundles
      state.createdAt = new Date(order.createdAt)
      state.email = order.email
      state.grandTotal = order.totalPrice
      state.id = order.id
      state._id = order._id
      state.orderLoadedOnce = true
      state.shipping.address = order.shippingAddress
      state.shipping.postage = order.shipping.postage
      state.refId = order.refId
      state.status = order.status
      state.subtotal = order.subtotal
      state.totalDiscount = order.totalDiscount
      state.totalPrice = order.totalPrice
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
      const order = await fetch(`${host}/order/${state.id}`, {
        mode: 'cors',
        credentials: 'include'
      }).then(res => res.json())
      console.log('order', order)
      commit('fetchingOrder', false)
      if (order === null) {
        commit('errorLoadingOrder', `Couldn't find order: ${state.id}`)
      } else if (order.id) {
        commit('setOrder', order)
      } else {
        commit('errorLoadingOrder', order.message)
      }
    },
    async fetchUserMeta ({ commit, state }: Action) {
      commit('fetchingUser', true)
      const userMeta = await fetch(`${host}/user/${state.userId}/meta`, {
        mode: 'cors',
        credentials: 'include'
      }).then(res => res.json())

      commit('fetchingUser', false)
      if (userMeta !== null || userMeta.meta) {
        commit('setUserRefId', userMeta.refId)
      }
      console.log('userMeta', userMeta)
    }
  }
}
