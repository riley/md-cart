import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import AccountSettings from './views/AccountSettings.vue'
import OneTimeOrder from './views/OneTimeOrder.vue'
import OrderDetail from './views/OrderDetail.vue'
import OrderHistory from './views/OrderHistory.vue'
import Refer from './views/Refer.vue'
import Snoozed from './views/Snoozed.vue'
import UpcomingOrders from './views/UpcomingOrders.vue'
import VipDetail from './views/VipDetail.vue'
import VipSettings from './views/VipSettings.vue'

import store from './store/admin'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/account-settings', name: 'accountSettings', component: AccountSettings },
  // { path: '/upcoming-orders', component: UpcomingOrders },
  { path: '/send-now', component: OneTimeOrder },
  { path: '/past-orders', name: 'orderHistory', component: OrderHistory },
  { path: '/vip-settings', name: 'vipList', component: VipSettings },
  { path: '/order/:id', name: 'orderDetail', component: OrderDetail },
  { path: '/vip/:id', name: 'vipDetail', component: VipDetail },
  { path: '/snooze', name: 'snooze', component: Snoozed },
  { path: '/refer', name: 'refer', component: Refer },
  { path: '*', redirect: '/' }
]

const base = window.location.hostname !== 'localhost' ? '/user' : '/admin.html'

const router = new VueRouter({
  mode: 'history',
  base,
  routes,
})

Vue.use(VueRouter)

new Vue({
  store,
  router,
  render: h => h(Admin)
}).$mount('#app')
