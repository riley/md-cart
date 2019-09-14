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
    address_1: string;
    address_2: string;
    city: string;
    state: string;
    zip: string;
    country: string
  }

  interface User {
    username: string
    shipping: {
      address: Address | null
    }
    billing: {
      address: Address | null
    }
    isVipCustomer: boolean
    cardMeta: null | {
      expYear: string
      expMonth: string
      lastFour: string
    }
  }

  interface ShippingRate {
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
