import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')

declare global {

  interface Window {
    Stripe: any;
  }

  interface Item {
    sku: string
    clothingType: string
    quantity: number
    cost: number
  }

  interface Product {
    cost?: number
    sku: string
    quantity: number
    deprecated: boolean
    size: string
    forceLowStock: boolean
    nextDelivery: string
    clothingType: string
    description: string
    swatch: string
    title: string
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

  interface SHippingRate {
    rate: number | string;
    est_delivery_days: number;
    service: string;
    postage: number;
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
