import { getToken, setToken, getRefId, unsetRefId } from '../utils/storage'
import { identifyTrack } from '../utils/tracking'
import { makeFetch } from '../utils/network'

const supportEmail = '<a href="mailto:support@mrdavis.com?subject=Trouble checking out">support@mrdavis.com</a>'

const refId = getRefId()

const urlParams = new URLSearchParams(location.search)
if (urlParams.get('token') != null) {
  // @ts-ignore
  setToken(urlParams.get('token'))
}

if (window.location.pathname.includes('cart')) {
  // if this is the cart page, hide the url params
  history.replaceState(null, document.title, `${location.protocol}//${location.host}/cart/`)
}

type ResponseHandler = (response: Response) => Promise<any>
// this either returns the JSON promise or throws
const handleJSONResponse = ({ errorString }: {errorString: string}): ResponseHandler => {
  return function (response: Response) {
    if (response.status > 399) {
      throw new Error(`status ${response.status}: ${errorString}`)
    }

    return response.json()
  }
}

export default {
  namespaced: true,
  state: {
    billing: {
      address: {
        name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      }
    },
    billingSameAsShipping: true,
    cartId: null,
    createRecurringVIP: false,
    credit: 0, // mr davis rewards + ks discount
    email: '',
    emailInvalid: false, // this is an invalid email
    emailTaken: false, // is the entered email in our system?
    fetching: false,
    globalErrorMessage: null,
    isNonVIPCheckIn: false,
    isReturningCustomer: false,
    isSendMore: false,
    isVip: false,
    items: [],
    loginFormActive: false,
    order: null,
    paypalAvailable: false,
    paypalCapturing: false,
    paypalOrderInit: null,
    paypalOrderComplete: null,
    processing: false,
    processingPaypal: false,
    processingError: null,
    refId: refId || '', // this is initialized above (might be null)
    shipping: {
      address: {
        name: '',
        address_1: '',
        address_2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
      },
      intlDiscount: 0,
      modified: false,
      postage: 0,
      rates: [], // first class, priority, etc
      service: null,
    },
    stock: [],
    token: null,
    totalTax: 0,
    useStoredBillingInfo: false,
    useStoredPaymentInfo: false,
    useStoredShippingInfo: false,
  },
  getters: {
    grandTotal: (state: any, getters: any) => {
      const itemCost = state.items.reduce((carry: number, item: Item) => carry + item.cost, 0)
      const calculatedReferralCredit = getters.referDiscountEligible ? getters.referralCredit : 0
      const calculatedNonVIPCheckInCredit = getters.nonVipDiscountEligible ? getters.nonVIPCheckInCredit : 0
      return Math.max(itemCost + state.shipping.postage + state.totalTax - state.credit - calculatedReferralCredit - calculatedNonVIPCheckInCredit, 0)
    },
    isStoredInfo: (state: any) => {
      return state.useStoredShippingInfo && state.useStoredBillingInfo && state.useStoredPaymentInfo
    },
    referDiscountEligible: (state: any, getters: any) => getters.subtotal >= 4000 && getters.referralCredit > 0 && !state.isReturningCustomer,
    nonVipDiscountEligible: (state: any, getters: any) => getters.subtotal >= 5000 && getters.nonVIPCheckInCredit > 0,
    subtotal: (state: any) => state.items.reduce((carry: number, item: Item) => carry + item.cost, 0),
    referralCredit: (state: any) => typeof state.refId === 'string' && [8, 9, 24].includes(state.refId.length) ? 1000 : 0,
    nonVIPCheckInCredit: (state: any) => state.isNonVIPCheckIn ? 1000 : 0
  },
  mutations: {
    addItem (state: any, sku: string) {
      const product = state.stock.find((product: Product) => product.sku === sku)
      const item = { sku, quantity: 1, clothingType: product.clothingType }
      state.items = [...state.items, item]
    },
    clearLoginForm (state: any) {
      state.loginFormActive = false
    },
    editStoredBillingAddress (state: any) {
      state.useStoredBillingInfo = false
      state.useStoredPaymentInfo = false
    },
    editStoredPaymentInfo (state: any) {
      state.useStoredPaymentInfo = false
    },
    editStoredShippingAddress (state: any) {
      state.useStoredShippingInfo = false
      state.useStoredBillingInfo = false
      state.useStoredPaymentInfo = false
    },
    loginCart (state: any, user: StoredUser) {
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
      state.email = user.username
      state.credit = user.credit
      state.useStoredBillingInfo = !!user.stripeId
      state.useStoredPaymentInfo = !!user.stripeId
      state.useStoredShippingInfo = true
      state.isReturningCustomer = true
      state.loginFormActive = false
    },
    logoutCart (state: any) {
      state.credit = 0
      state.useStoredShippingInfo = false
      state.useStoredBillingInfo = false
      state.useStoredPaymentInfo = false
      state.isReturningCustomer = false
    },
    removeItem (state: any, sku: string) {
      const indexToRemove = state.items.findIndex((item: Item) => item.sku === sku)
      state.items = state.items.filter((item: any, index: number) => index !== indexToRemove)
    },
    replaceBillingAddress (state: any, address: Address) {
      state.billing.address = address
    },
    replaceShippingAddress (state: any, address: Address) {
      state.shipping.address = address
    },
    setAddress (state: any, { location, field, value }: {location: string, field: string, value: string}) {
      state[location].address[field] = value
    },
    setBillingAddress (state: any, address: Address) {
      state.billing.address = address
    },
    setBillingSameAsShipping (state: any, checked: boolean) {
      state.billingSameAsShipping = checked
    },
    setCartId (state: any, id: string) {
      state.cartId = id
    },
    setCreateRecurringVIP (state: any, recurring: boolean) {
      state.createRecurringVIP = recurring
    },
    setCredit (state: any, credit: number) {
      state.credit = credit
    },
    setEmail (state: any, value: string) {
      state.email = value
    },
    setGlobalError (state: any, message: string) {
      state.globalErrorMessage = message
    },
    setFetching (state: any, status: boolean) {
      state.fetching = status
    },
    setIsReturningCustomer (state: any, status: boolean) {
      state.isReturningCustomer = status
    },
    setIsVip (state: any, isVip: boolean) {
      state.isVip = isVip
    },
    setItems (state: any, items: Item[]) {
      state.items = items
    },
    setPaypalAvailable (state: any, status: boolean) {
      state.paypalAvailable = status
    },
    setPaypalCapturing (state: any, status: boolean) {
      state.paypalCapturing = status
    },
    setPaypalOrderInit (state: any, data: PayPalOrderInit) {
      state.paypalOrderInit = data
    },
    setPaypalOrderComplete (state: any, data: PayPalOrderComplete) {
      state.paypalOrderComplete = data
    },
    setProcessing (state: any, status: boolean) {
      state.processing = status
    },
    setProcessingPaypal (state: any, status: boolean) {
      state.processingPaypal = status
    },
    setProcessingError (state: any, error: string) {
      state.processingError = error
    },
    setNonVipCheckIn (state: any, isNonVIPCheckIn: boolean) {
      state.isNonVIPCheckIn = isNonVIPCheckIn
    },
    setRefId (state: any, refId: string) {
      state.refId = refId
    },
    setShipping (state: any, shipping: ServerShipping) {
      state.shipping.postage = shipping.postage
      state.shipping.intlDiscount = shipping.intlDiscount
      state.shipping.rates = shipping.rates
      state.shipping.service = shipping.service
    },
    setShippingAddress (state: any, address: Address) {
      state.shipping.address = address
    },
    setSelectedShippingService (state: any, shippingService: string) {
      state.shipping.modified = true
      state.shipping.service = shippingService
    },
    setStock (state: any, stock: Product[]) {
      state.stock = stock
    },
    setTax (state: any, tax: number) {
      state.totalTax = tax
    },
    toggleLoginForm (state: any, active: boolean) {
      state.loginFormActive = active
    }
  },

  /**
  *
  * Actions
  *
  */

  actions: {
    /**
    * get the cart from the server initially
    */
    async fetchCart ({ commit, state, dispatch }: Action) {
      commit('setFetching', true)
      try {
        const cart = await makeFetch('/api/cart').then(handleJSONResponse({ errorString: 'failed to fetch cart' }))

        setToken(cart.token)
        commit('setFetching', false)
        commit('setCartId', cart._id)
        commit('setEmail', cart.email)
        commit('setShippingAddress', cart.shippingAddress)
        commit('setBillingAddress', cart.billingAddress)
        commit('setRefId', cart.refId)
        commit('setNonVipCheckIn', cart.isNonVIPCheckIn)
        commit('setIsVip', cart.bundles[0].isVip)
        commit('setItems', cart.bundles[0].skus)
        commit('setShipping', cart.shipping)
        commit('setCredit', cart.priceModification.userCredit.amount + cart.priceModification.ks.amount)
        commit('setTax', cart.totalTax)
        commit('user/setReturningVipCustomer', cart.user && cart.user.isVipCustomer, { root: true })

        if (cart.email) {
          identifyTrack({ email: cart.email, name: cart.shippingAddress.name })
        }
        dispatch('sendCheckoutStartEvent')
      } catch (e) {
        commit('setGlobalError', `Oh no! something went wrong while fetching your cart. Please contact us at ${supportEmail}.`)
        console.error(e)
      }
    },
    /**
    * update the cart upon user input
    */
    async updateCart ({ commit, state }: Action) {
      commit('setFetching', true)
      try {
        const { cart, token } = await makeFetch('/api/cart', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            billingAddress: state.billing.address,
            shippingAddress: state.shipping.address,
            shipping: {
              modified: state.shipping.modified,
              service: state.shipping.service,
            },
            refId: state.refId,
            createNewVip: state.createRecurringVIP,
            bundles: [{
              isVip: state.isVip,
              skus: state.items
            }]
          })
        }).then(handleJSONResponse({ errorString: 'Failed to update cart' }))

        commit('setFetching', false)
        commit('setItems', cart.bundles[0].skus)
        commit('setTax', cart.totalTax)
        commit('setShipping', cart.shipping)
        setToken(token)
      } catch (e) {
        // maybe there was a 401 or something?
        console.error(e)
        commit('setGlobalError', `Uh oh! We weren't able to update the cart. Please contact us at ${supportEmail}`)
      }
    },
    /**
    * get stock levels from the server
    */
    async fetchStock ({ commit, state }: Action) {
      commit('setFetching', true)

      try {
        const stock = await makeFetch('/api/products')
          .then(handleJSONResponse({ errorString: 'failed to fetch stock' }))
        commit('setStock', stock)
      } catch (e) {
        // show an error
        commit('setGlobalError', 'Oh no! We\'re having trouble getting product informtion for this page. The site might be having trouble, try reloading the page.')
      }

      commit('setFetching', false)
    },
    /**
    *
    * @param Action
    * @param email
    *
    * get various info about the user from the server
    */
    async checkUsername ({ commit, state }: Action, email: string) {
      try {
        const info = await makeFetch('/api/check-username', {
          method: 'POST',
          headers: {
            // going to leave this as form input because of the validation plugin on the backend
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
          },
          body: `username=${encodeURIComponent(email)}`
        })
          .then(handleJSONResponse({ errorString: 'Could not get username info' }))

        if (info.cart) {
          commit('user/setReturningVipCustomer', !!info.cart.returningVipCustomer, { root: true })
          commit('setItems', info.cart.bundles[0].skus) // cart pricing might have updated
          commit('setCredit', info.cart.priceModification.userCredit.amount + info.cart.priceModification.ks.amount)
          commit('setShipping', info.cart.shipping)
          commit('setRefId', info.cart.refId)
          // we don't set the shipping and billing here, that would be leaking PII
        }

        commit('user/setReturningCustomer', info.available === false, { root: true })
        commit('setIsReturningCustomer', info.available === false)
      } catch (e) {
        commit('setGlobalError', `Uh oh! We weren't able to update the cart. Please contact us at ${supportEmail}`)
        console.error(e)
      }
    },
    async attemptPurchase ({ commit, state, getters }: Action, stripeToken: any) {
      commit('setProcessing', true)
      let result
      let responseText
      try {
        const response = await makeFetch('/api/buy', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            createRecurringVIP: state.createRecurringVIP,
            isStoredInfo: getters.isStoredInfo,
            billingSameAsShipping: state.billingSameAsShipping,
            email: state.email,
            shippingAddress: state.shipping.address,
            billingAddress: state.billing.address,
            token: stripeToken,
          })
        })

        responseText = await response.body
        result = await response.json()
      } catch (e) {
        console.log(e)
        commit('setProcessingError', 'Something has gone wrong with our credit card processor. Please notify support@mrdavis.com.')
        window.woopra && window.woopra.track('cart-js-errors', { message: `[isSendMore: ${state.isSendMore}] [isNonVIPCheckIn: ${state.isNonVIPCheckIn}] [cart: ${state.cartId}] ${responseText}` })
        return
      }

      if (result.processed) {
        setToken(result.token)
        // it worked! unset the referring user
        unsetRefId()
        location.href = `/thankyou`
      } else {
        const errorMessage = result.errors.map((err: PaymentError) => err.msg).join('<br>')
        commit('setProcessingError', errorMessage)
        window.woopra && window.woopra.track('cart-js-errors', { message: `[isSendMore: ${state.isSendMore}] [isNonVIPCheckIn: ${state.isNonVIPCheckIn}] ${errorMessage}` })
        commit('setProcessing', false)
      }
    },
    // send events to klaviyo
    async sendCheckoutStartEvent ({ state, getters }: Action) {
      if (!state.email || state.stock.length === 0 || state.items.length === 0) return

      const event = {
        '$event_id': state.cartId,
        '$value': getters.subtotal / 100,
        'Item Names': state.items.map((item: Item) => {
          const product = state.stock.find((product: Product) => product.sku === item.sku)
          return product.title
        }),
        'CheckoutURL': `https://mrdavis.com/cart?token=${getToken()}`,
        'Items': state.items.map((item: Item) => {
          const product = state.stock.find((product: Product) => product.sku === item.sku)
          return {
            'SKU': item.sku,
            'ProductName': product.title,
            'Quantity': item.quantity,
            'ItemPrice': item.cost / 100,
            'RowTotal': item.cost / 100,
            'ProductURL': product.url,
            'ImageURL': `https://account.mrdavis.com/img/${product.swatch}`,
            'ProductCategories': [item.clothingType, product.gender]
          }
        })
      }
      console.log('start checkout', event)

      window._learnq.push(['track', 'Start Checkout', event])
    },
    // start the paypal order process
    async createPaypalOrder ({ commit, state }: Action) {
      commit('setProcessing', true)
      commit('setProcessingPaypal', true)

      let result = await makeFetch('/api/orders/paypal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      }).then(res => res.json())

      const { token, ...data } = result

      setToken(token)
      commit('setPaypalOrderInit', data)
    },
    // update shipping to Canado or whatever
    async updatePaypalShipping ({ commit }: Action, shippingAddress: PayPalShippingAddress) {
      let response = await makeFetch('/api/orders/paypal', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shippingAddress })
      })

      if (response.status !== 200) {
        window.woopra?.track('cart-js-errors', 'something wrong with the paypal update shipping endpoint')
      }

      const { token, processed, order } = await response.json()

      setToken(token)

      if (processed) {
        // this was a free order
        location.href = '/thankyou'
      }

      return order
    },
    // complete the paypal checkout flow
    async completePaypalOrder ({ commit, state }: Action, { data, details }: any) {
      let result = await makeFetch('/api/orders/paypal', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, details })
      }).then(res => res.json())

      const { order, token } = result

      setToken(token)

      if (order && order.message) {
        // something has gone wrong
        commit('setGlobalError', `Something went wrong while processing your PayPal order. ${order.message}`)
        return
      }

      commit('setPaypalOrderComplete', order)

      window.woopra?.track('paypal-order-complete')

      unsetRefId()
      location.href = '/thankyou'
    }
  }
}
