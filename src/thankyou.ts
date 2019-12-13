import Vue from 'vue'
import OrderDetails from './OrderDetails.vue'
import ItemSummary from './OrderItemSummary.vue'
import store from './store/store'

window.gtag('config', process.env.VUE_APP_GOOG_CONVERSION_ID)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(OrderDetails)
}).$mount('#order-details')

new Vue({
  store,
  render: h => h(ItemSummary)
}).$mount('#item-summary')
