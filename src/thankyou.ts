import Vue from 'vue'
import Order from './views/Order.vue'
import store from './store/store'

window.gtag('config', process.env.VUE_APP_GOOG_CONVERSION_ID)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(Order)
}).$mount('#order')
