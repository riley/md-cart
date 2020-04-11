import Vue from 'vue'
import ActionChooser from './components/ActionChooser.vue'
import UpcomingOrders from './components/UpcomingOrders.vue'
import OneTimeOrder from './components/OneTimeOrder.vue'
import AccountSettings from './components/AccountSettings.vue'
import OrderHistory from './components/OrderHistory.vue'
import VipSettings from './components/VipSettings.vue'
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
