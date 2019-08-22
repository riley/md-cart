import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

store.commit('increment')
console.log('store.state.count', store.state.count)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

declare global {

  interface Window {
    Stripe: any;
  }
  interface Address {
    name: string;
    address1: string;
    address2: string;
    city: string;
    state: string;
    zip: string;
    country: string
  }

  interface DropdownOption {
    label: string;
    code: string;
  }

  interface FormInputEvent {
    name: string;
    value: string;
  }
}
