import { getToken, setToken, getRefId } from '../utils/storage'

const supportEmail = '<a href="mailto:support@mrdavis.com?subject=Trouble checking out">support@mrdavis.com</a>'

let host: string
if (window.location.host === 'mrdavis.com') {
  host = process.env.VUE_APP_PROD_HOST
} else if (window.location.host === 'staging-mrdavis.kinsta.com') {
  host = process.env.VUE_APP_STG_HOST
} else {
  host = process.env.VUE_APP_DEV_HOST
}

const refId = getRefId()

const urlParams = new URLSearchParams(location.search)
if (urlParams.get('token') != null) {
  // @ts-ignore
  setToken(urlParams.get('token'))
}

history.replaceState(null, document.title, `https://${location.host}/cart/`)

const userSettings: User = {
  username: '',
  shipping: { address: null },
  billing: { address: null },
  isVipCustomer: false,
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
    refId: refId || '', // this is initialized above (might be null)
    returningVipCustomer: false,
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
    totalDiscount: 0,
    totalTax: 0,
    useStoredBillingInfo: false,
    useStoredPaymentInfo: false,
    useStoredShippingInfo: false,
    user: { ...userSettings },
    welcomeBackCardDismissed: false,
  },
  getters: {
    grandTotal: (state: any) => {
      const itemCost = state.items.reduce((carry: number, item: Item) => carry + item.cost, 0)
      return Math.max(itemCost, 0)
    },
    isStoredInfo: (state: any) => {
      return state.useStoredShippingInfo && state.useStoredBillingInfo && state.useStoredPaymentInfo
    },
    userLoggedIn: (state: any) => state.user.username !== '',
    totalDiscount: (state: any) => state.credit,
    referDiscountEligible: (state: any) => state.subtotal >= 4000 && state.refId !== '',
    subtotal: (state: any) => state.items.reduce((carry: number, item: Item) => carry + item.cost, 0),
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
      state.useStoredShippingInfo = false
      state.useStoredBillingInfo = false
      state.useStoredPaymentInfo = false
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
    setRecurringVIP (state: any, recurring: boolean) {
      state.createRecurringVIP = recurring
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
    setSelectedShippingService (state: any, shippingRate: any) {
      state.shipping.modified = true
      state.shipping.service = shippingRate.value
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
          isVipCustomer: user.isVipCustomer,
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
    setWelcomeBackCardDismissed (state: any, dismissed: boolean) {
      state.welcomeBackCardDismissed = dismissed
    },
    toggleLoginForm (state: any, active: boolean) {
      state.loginFormActive = active
    }
  },
  actions: {
    async fetchCart ({ commit }: Action) {
      commit('setFetching', true)
      try {
        const cart = await fetch(`${host}/v2/cart`, {
          mode: 'cors',
          headers: new Headers({
            'Authorization': `Bearer ${getToken()}`
          })
        }).then(res => res.json())

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
        commit('setCredit', cart.priceModification.userCredit + cart.priceModification.ks)
        commit('setTax', cart.totalTax)
        commit('setUser', cart.user)
      } catch (e) {
        commit('setGlobalError', `Oh no! something went wrong while fetching your cart. Please contact us at ${supportEmail}.`)
        console.error(e)
      }
    },
    async updateCart ({ commit, state }: Action) {
      commit('setFetching', true)
      try {
        const { cart, token } = await fetch(`${host}/v2/cart`, {
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
            createNewVip: null,
            bundles: [{
              isVip: state.isVip,
              skus: state.items
            }]
          })
        }).then(res => res.json())

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
    async fetchStock ({ commit }: Action) {
      commit('setFetching', true)

      try {
        const stock = await fetch(`${host}/v1/products`).then(res => res.json())
        commit('setStock', stock)
      } catch (e) {
        // show an error
        console.log('oops', e)
        commit('setGlobalError', 'Oh no! We\'re having trouble getting product informtion for this page. The site might be having trouble, try reloading the page.')
      }

      commit('setFetching', false)
    },
    async checkUsername ({ commit, state }: Action, email: string) {
      try {
        const info = await fetch(`${host}/check-username`, {
          method: 'POST',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            'Authorization': `Bearer ${getToken()}`
          },
          body: `username=${encodeURIComponent(email)}`
        })
          .then(res => res.json())

        if (info.cart) {
          commit('setReturningVipCustomer', !!info.cart.returningVipCustomer)
        }

        if (info.available === false) {
          commit('setReturningCustomer', true)
        }

        console.log(info)
      } catch (e) {
        commit('setGlobalError', `Uh oh! We weren't able to update the cart. Please contact us at ${supportEmail}`)
        console.error(e)
      }
    },
    async requestLoginEmail ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.identify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      await fetch(`${host}/cart-request-login-code`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ username, brand: 'mrdavis' })
      })

      commit('loginEmailRequested', true)
    },
    async login ({ commit, state }: Action, { username, magicCode }: {username: string, magicCode: string}) {
      window.woopra && window.woopra.track('login-attempt', { username, code: magicCode })

      const info = await fetch(`${host}/login-existing`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ username, magicCode })
      }).then(res => res.json())

      console.log('info from login-existing', info)

      if (info.token) {
        commit('setUser', info.user)
        commit('setBillingAddress', info.cart.billingAddress)
        commit('setShippingAddress', info.cart.shippingAddress)
        commit('setEmail', info.cart.email)
        commit('clearLoginForm')
        setToken(info.token)
      } else {
        commit('loginFailure', info.error)
        window.woopra && window.woopra.track('login-failure', { username, message: info.error })
      }
    },
    async logout ({ commit, state }: Action) {
      commit('logout')

      const response = await fetch(`${host}/logout-cart`, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      })

      console.log('logout response', response)

      const token = await response.text()

      console.log('token?', token)

      setToken(token)
    },
    async attemptPurchase ({ commit, state, getters }: Action, token: any) {
      commit('setProcessing', true)
      const result = await fetch(`${host}/buy`, {
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
          token,
        })
      }).then((res: any) => res.json())

      console.log(result)

      if (result.processed) {
        setToken(result.token)
        location.href = `/thankyou`
      } else {
        const errorMessage = result.errors.map((err: PaymentError) => err.msg).join('\n')
        commit('setGlobalError', errorMessage)
        commit('setProcessing', false)
        console.log('some error happened')
      }
    }
  }
}
