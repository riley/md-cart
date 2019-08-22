import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

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
    count: 0,
    email: '',
    errors: null,
    isNonVIPCheckIn: false,
    isReturningCustomer: false,
    isSendMore: false,
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
      }
    },
    subtotal: 5000,
    token: null,
    totalDiscount: 0,
    userLoggedIn: false,
  },
  getters: {
    total: state => state.subtotal
  },
  mutations: {
    setAddress (state: any, payload) {
      state[payload.location].address[payload.field] = payload.value
    },
    setEmail (state: any, payload) {
      console.log('setEmail mutation', payload.value)
      state.email = payload.value
    },
    setBillingSameAsShipping (state: any, checked: boolean) {
      state.billingSameAsShipping = checked
    },
    itemQuantity (state, payload) {

    },
    increment (state) {
      state.count++
    }
  },
  actions: {

  }
})
