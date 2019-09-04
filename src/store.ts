import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const host = process.env.VUE_APP_MD_HOST

export default new Vuex.Store({
  state: {
    billing: {
      address: {
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      }
    },
    billingSameAsShipping: true,
    cartId: null,
    csrfToken: null,
    email: '',
    emailInvalid: false, // this is an invalid email
    emailTaken: false, // is the entered email in our system?
    errors: null,
    fetching: false,
    isNonVIPCheckIn: false,
    isReturningCustomer: false,
    isSendMore: false,
    isVip: false,
    items: [],
    shipping: {
      address: {
        name: '',
        address1: '',
        address2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      postage: 0,
      intlDiscount: 0,
      rates: [] // first class, priority, etc
    },
    stock: [],
    subtotal: 5000,
    token: null,
    totalDiscount: 0,
    userLoggedIn: false,
  },
  getters: {
    total: state => state.items.reduce((carry, item: Item) => carry + item.cost, 0)
  },
  mutations: {
    addItem (state: any, { sku, quantity }) {

    },
    removeItem (state: any, sku) {
      const indexToRemove = state.items.findIndex((item: Item) => item.sku === sku)
      state = state.items.filter((item: any, index: number) => index !== indexToRemove)
    },
    setAddress (state: any, { location, field, value }) {
      state[location].address[field] = value
    },
    setBillingSameAsShipping (state: any, checked: boolean) {
      state.billingSameAsShipping = checked
    },
    setCartId (state, id) {
      console.log('setCartId', id)
      state.cartId = id
    },
    setCsrfToken (state, token) {
      state.csrfToken = token
    },
    setEmail (state: any, { value }) {
      state.email = value
    },
    setFetching (state: any, status: boolean) {
      state.fetching = status
    },
    setItems (state: any, items) {
      state.items = items
    },
    setShipping (state: any, shipping) {
      console.log('setShipping', shipping)
    },
    setSelectedShippingService (state: any, service: any) {
      console.log('setSelectedShippingService', service)
    },
    setStock (state: any, stock) {
      state.stock = stock
    }
  },
  actions: {
    async fetchCart ({ commit }) {
      commit('setFetching', true)
      const cartId = '5c071559f237b80004f16f7d'
      try {
        const cart = await fetch(`${host}/v2/cart?id=${cartId}`, {
          mode: 'cors',
          credentials: 'include',
        }).then(res => res.json())
        commit('setCartId', cart._id)
        commit('setItems', cart.bundles[0].skus)
        commit('setCsrfToken', cart.csrfToken)
        commit('setFetching', false)
        commit('setShipping', cart.shipping)
        console.log(cart.bundles)
      } catch (e) {
        console.error(e)
      }
    },
    async updateCart ({ commit, state }) {
      commit('setFetching', true)
      await fetch(`${host}/v2/cart`, {
        method: 'PUT',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          billingAddress: state.billing.address,
          shippingAddress: state.shipping.address,
          shipping: null,
          createNewVip: null,
          bundles: []
        })
      })
    },
    async fetchStock ({ commit }) {
      commit('setFetching', true)
      const stock = await fetch(`${host}/v1/products`).then(res => res.json())
      commit('setStock', stock)
      commit('setFetching', false)
    },
    async checkUsername ({ commit }, email) {
      try {
        const info = await fetch(`${host}/check-username`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: `username=${encodeURIComponent(email)}`
        })
          .then(res => res.json())

        console.log(info)
      } catch (e) {
        console.error(e)
      }
    }
  }
})
