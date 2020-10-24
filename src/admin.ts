import Vue from 'vue'
import AccountSettings from './views/AccountSettings.vue'
import ActionChooser from './views/ActionChooser.vue'
import OneTimeOrder from './views/OneTimeOrder.vue'
import OrderHistory from './views/OrderHistory.vue'
import UpcomingOrders from './views/UpcomingOrders.vue'
import VipSettings from './views/VipSettings.vue'
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
}).$mount('#send-now')

// update address, billing info
new Vue({
  store,
  render: h => h(AccountSettings)
}).$mount('#account-settings')

// see a list of user orders
new Vue({
  store,
  render: h => h(OrderHistory)
}).$mount('#past-orders')

// edit settings for vips associated with this user
new Vue({
  store,
  render: h => h(VipSettings)
}).$mount('#vip-settings')
