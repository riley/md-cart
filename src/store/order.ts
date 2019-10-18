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
    grandTotal: 0,
    id: '',
    refId: '',
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
  },
  getters: {
    referDiscount (state: any) {
      return state.refId !== ''
    }
  },
  mutations: {
    setOrder (state: any, order: any) {
      console.log('we got the order', order)
      state.billing.address = order.billingAddress
      state.bundles = order.bundles
      state.createdAt = new Date(order.createdAt)
      state.email = order.email
      state.grandTotal = order.totalPrice
      state.id = order.id
      state.shipping.address = order.shippingAddress
      state.shipping.postage = order.shipping.postage
      state.status = order.status
      state.subtotal = order.subtotal
      state.totalDiscount = order.totalDiscount
      state.totalPrice = order.totalPrice
      state.totalTax = order.totalTax
    },
  },
  actions: {
    async fetchOrder ({ commit, state }: Action, orderId: string) {
      const order = await fetch(`${host}/order/${orderId}`, {
        mode: 'cors',
        credentials: 'include'
      }).then(res => res.json())
      commit('setOrder', order)
    },
  }
}
