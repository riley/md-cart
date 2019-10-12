import Vue from 'vue'
import Thankyou from './Thankyou.vue'
import store from './store/store'

window.gtag('config', process.env.VUE_APP_GOOG_CONVERSION_ID)

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(Thankyou)
}).$mount('#app')
