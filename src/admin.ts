import Vue from 'vue'
import ActionChooser from './ActionChooser.vue'
import UpcomingOrders from './UpcomingOrders.vue'
import OneTimeOrder from './OneTimeOrder.vue'
import AccountSettings from './AccountSettings.vue'
import OrderHistory from './OrderHistory.vue'
import VipSettings from './VipSettings.vue'
import store from './store/admin'

// the actions you can choose at the top
new Vue({
  store,
  render: h => h(ActionChooser)
}).$mount('#action-chooser')

// status of recently placed orders
new Vue({
  store,
  render: h => h(UpcomingOrders)
}).$mount('#upcoming-orders')

// Send Now
new Vue({
  store,
  render: h => h(OneTimeOrder)
}).$mount('#one-time-order')

// update address, billing info
new Vue({
  store,
  render: h => h(AccountSettings)
}).$mount('#account-settings')

// see a list of user orders
new Vue({
  store,
  render: h => h(OrderHistory)
}).$mount('#order-history')

// edit settings for vips associated with this user
new Vue({
  store,
  render: h => h(VipSettings)
}).$mount('#vip-settings')
