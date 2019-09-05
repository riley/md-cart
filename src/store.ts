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
    refId: '',
    returningVipCustomer: false,
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
      intlDiscount: 0,
      modified: false,
      postage: 0,
      rates: [], // first class, priority, etc
      service: null,
    },
    stock: [],
    subtotal: 5000,
    token: null,
    totalDiscount: 0,
    totalTax: 0,
    user: {
      username: '',
      shipping: {
        address: null
      },
      billing: {
        address: null
      }
    },
    userLoggedIn: false,
  },
  getters: {
    grandTotal: state => {
      const itemCost = state.items.reduce((carry, item: Item) => carry + item.cost, 0)
      return Math.max(itemCost, 0)
    },
    totalDiscount: state => 0,
    referDiscountEligible: state => state.subtotal >= 4000 && state.refId !== ''
  },
  mutations: {
    addItem (state: any, item: Item) {
      state.items = [...state.items, item]
    },
    removeItem (state: any, sku) {
      const indexToRemove = state.items.findIndex((item: Item) => item.sku === sku)
      state.items = state.items.filter((item: any, index: number) => index !== indexToRemove)
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
      state.shipping.postage = shipping.postage
      state.shipping.intlDiscount = shipping.intlDiscount
      state.shipping.rates = shipping.rates
    },
    setSelectedShippingService (state: any, shippingRate: any) {
      state.shipping.modified = true
      state.shipping.service = shippingRate.value
    },
    setStock (state: any, stock) {
      state.stock = stock
    },
    setTax (state: any, tax) {
      state.totalTax = tax
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
        commit('setTax', cart.totalTax)
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
          shipping: {
            modified: state.shipping.modified,
            service: state.shipping.service,
          },
          createNewVip: null,
          bundles: [{
            isVip: state.isVip,
            skus: state.items
          }]
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
