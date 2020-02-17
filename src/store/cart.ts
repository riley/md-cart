import { getToken, setToken, getRefId, unsetRefId } from '../utils/storage'
import { host } from '../utils/computed'

const supportEmail = '<a href="mailto:support@mrdavis.com?subject=Trouble checking out">support@mrdavis.com</a>'

const refId = getRefId()

const urlParams = new URLSearchParams(location.search)
if (urlParams.get('token') != null) {
  // @ts-ignore
  setToken(urlParams.get('token'))
}

if (window.location.pathname.includes('cart')) {
  // if this is the cart page, hide the url params
  history.replaceState(null, document.title, `https://${location.host}/cart/`)
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

const userSettings: User = {
  username: '',
  shipping: { address: null },
  billing: { address: null },
  cardMeta: null,
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
    host,
    isNonVIPCheckIn: false,
    isReturningCustomer: false,
    isSendMore: false,
    isVip: false,
    items: [],
    loginEmailRequested: false,
    loginErrorMessage: '',
    loginFormActive: false,
    order: null,
    processing: false,
    processingError: null,
    refId: refId || '', // this is initialized above (might be null)
    returningVipCustomer: null, // if set, it's an id
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
    user: { ...userSettings },
  },
  getters: {
    grandTotal: (state: any, getters: any) => {
      const itemCost = state.items.reduce((carry: number, item: Item) => carry + item.cost, 0)
      return Math.max(itemCost + state.shipping.postage + state.totalTax - state.credit - getters.referralCredit, 0)
    },
    isStoredInfo: (state: any) => {
      return state.useStoredShippingInfo && state.useStoredBillingInfo && state.useStoredPaymentInfo
    },
    userLoggedIn: (state: any) => state.user.username !== '',
    referDiscountEligible: (state: any) => state.subtotal >= 4000 && state.refId !== '',
    subtotal: (state: any) => state.items.reduce((carry: number, item: Item) => carry + item.cost, 0),
    referralCredit: (state: any) => typeof state.refId === 'string' && state.refId.length === 8 ? 1000 : 0
  },
  mutations: {
    addItem (state: any, item: Item) {
      state.items = [...state.items, item]
    },
    clearLoginForm (state: any) {
      state.loginEmailRequested = false
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
    loginEmailRequested (state: any, requested: boolean) {
      state.loginEmailRequested = requested
    },
    loginFailure (state: any, message: string) {
      state.loginErrorMessage = message
    },
    logout (state: any) {
      state.user = { ...userSettings }
      state.credit = 0
      state.useStoredShippingInfo = false
      state.useStoredBillingInfo = false
      state.useStoredPaymentInfo = false
      state.isReturningCustomer = false
      state.returningVipCustomer = false
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
    setIsVip (state: any, isVip: boolean) {
      state.isVip = isVip
    },
    setItems (state: any, items: Item[]) {
      state.items = items
    },
    setProcessing (state: any, status: boolean) {
      state.processing = status
    },
    setProcessingError (state: any, error: string) {
      state.processingError = error
    },
    setReturningCustomer (state: any, returning: boolean) {
      state.isReturningCustomer = returning
    },
    setReturningVipCustomer (state: any, returning: boolean) {
      state.returningVipCustomer = returning
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
    setUser (state: any, user: any) {
      if (user == null) {
        state.user = { ...userSettings }
      } else {
        state.user = {
          username: user.username,
          shipping: { address: user.shippingAddress },
          billing: { address: user.billingAddress },
          cardMeta: user.cardMeta,
        }
        state.useStoredBillingInfo = true
        state.useStoredShippingInfo = true
        state.useStoredPaymentInfo = true
        state.isReturningCustomer = true

        window.woopra && window.woopra.identify({
          email: user.username,
          name: user.shippingAddress.name
        })
        window.woopra && window.woopra.track()
      }
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
    async fetchCart ({ commit, state }: Action) {
      commit('setFetching', true)
      try {
        const cart = await fetch(`${state.host}/v2/cart`, {
          mode: 'cors',
          headers: new Headers({
            'Authorization': `Bearer ${getToken()}`
          })
        }).then(handleJSONResponse({ errorString: 'failed to fetch cart' }))

        setToken(cart.token)
        commit('setFetching', false)
        commit('setCartId', cart._id)
        commit('setEmail', cart.email)
        commit('setShippingAddress', cart.shippingAddress)
        commit('setBillingAddress', cart.billingAddress)
        commit('setRefId', cart.refId)
        commit('setIsVip', cart.bundles[0].isVip)
        commit('setItems', cart.bundles[0].skus)
        commit('setShipping', cart.shipping)
        commit('setCredit', cart.priceModification.userCredit.amount + cart.priceModification.ks.amount)
        commit('setTax', cart.totalTax)
        commit('setUser', cart.user)
        commit('setReturningVipCustomer', cart.user && cart.user.isVipCustomer)
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
        const { cart, token } = await fetch(`${state.host}/v2/cart`, {
          method: 'PATCH',
          mode: 'cors',
          headers: new Headers({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          }),
          body: JSON.stringify({
            billingAddress: state.billing.address,
            shippingAddress: state.shipping.address,
            shipping: {
              modified: state.shipping.modified,
              service: state.shipping.service,
            },
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
        const stock = await fetch(`${state.host}/v1/products`)
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
        const info = await fetch(`${state.host}/check-username`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            // going to leave this as form input because of the validation plugin on the backend
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': `Bearer ${getToken()}`
          },
          body: `username=${encodeURIComponent(email)}`
        })
          .then(handleJSONResponse({ errorString: 'Could not get username info' }))

        if (info.cart) {
          commit('setReturningVipCustomer', !!info.cart.returningVipCustomer)
          commit('setItems', info.cart.bundles[0].skus) // cart pricing might have updated
          commit('setCredit', info.cart.priceModification.userCredit.amount + info.cart.priceModification.ks.amount)
          commit('setShipping', info.cart.shipping)
          // we don't set the shipping and billing here, that would be leaking PII
        }

        if (info.available === false) {
          commit('setReturningCustomer', true)
        }
      } catch (e) {
        commit('setGlobalError', `Uh oh! We weren't able to update the cart. Please contact us at ${supportEmail}`)
        console.error(e)
      }
    },
    async requestLoginEmail ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.identify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      try {
        await fetch(`${state.host}/cart-request-login-code`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ username, brand: 'mrdavis' })
        }).then(res => {
          if (res.status !== 200) throw new Error('Login request failed to send code.')
        })
      } catch (e) {
        console.error(e)
        commit('loginFailure', 'We\'re having trouble sending your login email. Please try again in a few minutes, or contact us at <a href="mailto:support@mrdavis.com">support@mrdavis.com</a>. Sorry for the trouble.')
        return
      }

      commit('loginEmailRequested', true)
    },
    async login ({ commit, state }: Action, { username, magicCode }: {username: string, magicCode: string}) {
      window.woopra && window.woopra.track('login-attempt', { username, code: magicCode })
      let info

      try {
        info = await fetch(`${state.host}/login-existing`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
          },
          body: JSON.stringify({ username, magicCode })
        }).then(handleJSONResponse({ errorString: 'code failed to login user' }))
      } catch (e) {
        commit('loginFailure', 'Something went wrong with our login service. Please try again in a few minutes, or contact us at <a href="mailto:support@mrdavis.com">support@mrdavis.com</a>. Sorry for the trouble.')
        return
      }

      if (info.token) {
        commit('setUser', info.user)
        commit('setBillingAddress', info.cart.billingAddress)
        commit('setShippingAddress', info.cart.shippingAddress)
        commit('setEmail', info.cart.email)
        commit('setCredit', info.user.credit)
        commit('clearLoginForm')
        setToken(info.token)
      } else {
        commit('loginFailure', info.error)
        window.woopra && window.woopra.track('login-failure', { username, message: info.error })
      }
    },
    async logout ({ commit, state }: Action) {
      commit('logout')

      const response = await fetch(`${state.host}/logout-cart`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      const token = await response.text()

      setToken(token)
    },
    async attemptPurchase ({ commit, state, getters }: Action, stripeToken: any) {
      commit('setProcessing', true)
      let result
      try {
        result = await fetch(`${state.host}/buy`, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getToken()}`
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
        }).then(response => {
          if (response.status <= 400) {
            return response.json()
          } else {
            // something has gone wrong with the service, not bad user input.
            // probably improve this process at some point.
            throw new Error('Something has gone wrong with our credit card processor. Please notify support@mrdavis.com.')
          }
        })
      } catch (e) {
        commit('setProcessingError', e.message)
        return
      }

      if (result.processed) {
        setToken(result.token)
        // it worked! unset the referring user
        unsetRefId()
        location.href = `/thankyou`
      } else {
        const errorMessage = result.errors.map((err: PaymentError) => err.msg).join('\n')
        commit('setProcessingError', errorMessage)
        commit('setProcessing', false)
      }
    }
  }
}
