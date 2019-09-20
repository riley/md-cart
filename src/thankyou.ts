import Vue from 'vue'
import Thankyou from './Thankyou.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(Thankyou)
}).$mount('#app')
