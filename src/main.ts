import Vue from 'vue'
import CartSummary from './components/CartSummary.vue'
import CustomerInfoInputs from './components/CustomerInfoInputs.vue'
import store from './store/store'

Vue.config.productionTip = false

// get cartId from

new Vue({
  store,
  render: h => h(CartSummary)
}).$mount('#cart-summary')

new Vue({
  store,
  render: h => h(CustomerInfoInputs)
}).$mount('#forms-target')
declare global {

  interface Window {
    Stripe: any
    google: any
    woopra: any
    gtag: any
    fbq: any
    mapsCallback: any
  }

  interface Item {
    sku: string
    clothingType: string
    quantity: number
    cost: number
  }

  interface Bundle {
    skus: Item[]
    recurringSkus: Item[]
    isVip: boolean
  }

  interface Order {
    id: string
    bundles: Bundle[],
    createdAt: Date
    totalPrice: number
    totalTax: number
    shipping: {
      postage: number
    }
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
    color?: string
  }

  interface GoogleAnalyticsConversionItem {
    id: string
    name: string
    list_name: string
    brand: string
    category: string
    variant?: string
    list_position?: number
    quantity: number
    price: string
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

  interface ServerShipping {
    intlDiscount: number
    postage: number
    rates: any[]
    service: string
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

  interface Action {
    commit: any
    state?: any
  }
}
