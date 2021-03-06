import Vue from 'vue'
import VueRouter from 'vue-router'
import Admin from './views/Admin.vue'
import Home from './views/Home.vue'
import AccountSettings from './views/AccountSettings.vue'
import OneTimeOrder from './views/OneTimeOrder.vue'
import OrderDetail from './views/OrderDetail.vue'
import OrderHistory from './views/OrderHistory.vue'
import Snoozed from './views/Snoozed.vue'
import UpcomingOrders from './views/UpcomingOrders.vue'
import VipDetail from './views/VipDetail.vue'
import VipSettings from './views/VipSettings.vue'

import store from './store/admin'

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/account-settings', component: AccountSettings },
  { path: '/upcoming-orders', component: UpcomingOrders },
  { path: '/send-now', component: OneTimeOrder },
  { path: '/past-orders', component: OrderHistory },
  { path: '/vip-settings', component: VipSettings },
  { path: '/order/:id', name: 'orderDetail', component: OrderDetail },
  { path: '/vip/:id', name: 'vipDetail', component: VipDetail },
  { path: '/snooze', name: 'snooze', component: Snoozed },
  { path: '*', redirect: '/' }
]

const base = window.location.hostname !== 'localhost' ? '/account-staging-area' : '/admin.html'

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
