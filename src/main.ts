import Vue from 'vue'
import Cart from './views/Cart.vue'
import store from './store/store'

import { setToken } from './utils/storage'

Vue.config.productionTip = false

const url = new URL(location.href)
if (url.searchParams.get('token')) {
  setToken(url.searchParams.get('token') + '')
}

window._learnq = window._learnq || []

// set up google maps
const script = document.createElement('script')
script.async = true
script.defer = true
script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.VUE_APP_MAPS_API_KEY}&libraries=places`
document.head.appendChild(script)

new Vue({
  store,
  render: h => h(Cart)
}).$mount('#app')
declare global {

  interface Window {
    Stripe: any
    google: any
    woopra: any
    gtag: any
    fbq: any
    mapsCallback: any
    paypal: any
    location: Location
    gapi: any
    renderOptIn: () => void
    _learnq: any
    obApi: any
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
    recurringPrice: number
  }

  interface PricingBundle {
    skus: Item[]
    isVip: boolean
    pricingTier: number
  }

  interface Pricing {
    nextItemPrice: {
      [clothingType: string]: {
        baseSingle: number
        nonVip: number
        nonVipItemPrice: number
        vipItemPrice: number
        vip: number
      }
    }
    nonVip: number
    pricingTier: number
    vip: number
    skus: Item[]
  }

  interface OrderMap {
    [key: string]: Order
  }

  interface VipMap {
    [key: string]: VIP
  }

  interface Order {
    _id: string
    id: string
    bundles: Bundle[],
    createdAt: Date
    totalPrice: number
    totalTax: number
    shipping: {
      postage: number
    }
  }

  interface PayPalOrderInit {
    id: string
    processed: boolean
  }

  interface PayPalOrderComplete {
    id: string
    message?: string
  }

  interface PayPalActions {
    resolve: () => Promise<void>
    reject: () => Promise<void>
  }

  interface PayPalShippingAddress {
    address_line_1: string
    address_line_2: string
    admin_area_2: string
    admin_area_1: string
    postal_code: string
    country_code: string
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
    icon: string
    gtin12: string
  }

  interface GooglePlace {
    streetNumber: string
    route: string
    city: string
    state: string
    zip: string
    country: string
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

  interface StoredUser {
    _id: string
    username: string
    billingAddress: Address
    credit: number
    cardMeta: {
      lastFour: string
      expMonth: string
      expYear: string
    }
    orders: string[],
    vips: string[],
    paypalPayerId?: string
    stripeId?: string
    refId: string
    shippingAddress: Address
  }

  interface User {
    username: string
    shipping: {
      address: Address | null
    }
    billing: {
      address: Address | null
    }
    cardMeta: null | {
      expYear: string
      expMonth: string
      lastFour: string
    }
  }

  interface VIP {
    _id: string
    createdAt: Date
    nextDelivery: Date
    vipPrice: number
    items: Item[]
    pricingTier: number
    cycleDays: number
    status: string
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

  interface PaymentError {
    param: string
    msg: string
  }

  interface Action {
    commit: any
    state?: any
    getters?: any
    dispatch?: any
  }

  interface ProductMeta {
    [clothingType: string]: {
      prompt: string
      props: {
        [key: string]: (string|{label: string, value: string})[]
      },
      addMore: string[]
    }
  }

  enum ButtonVariant {
    disabled = 'disabled',
    primary = 'primary',
    success = 'success',
    warning = 'warning',
    danger = 'danger'
  }

  interface StripeToken {
    card: {
      address_city: string
      address_country: string
      address_line1: string
      address_line1_check: string
      address_line2: string
      address_state: string
      address_zip: string
      address_zip_check: string
      brand: string
      country: string
      cvc_check: string
      dynamic_last4: null
      exp_month: number
      exp_year: number
      funding: string
      id: string
      last4: string
      name: string
      object: string
      tokenization_method: string
    }
    client_ip: string
    created: number
    id: string
    livemode: boolean
    object: string
    type: string
    used: boolean
  }
}
