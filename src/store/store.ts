import Vue from 'vue'
import Vuex from 'vuex'
import cart from './cart'
import order from './order'
import user from './user'

Vue.use(Vuex)

// this store is for the cart page
export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: { cart, order, user }
})
