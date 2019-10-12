const host = window.location.host === 'mrdavis.com' ? '//account.mrdavis.com' : 'https://localhost'
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
    csrfToken: '',
    email: '',
    emailInvalid: false, // this is an invalid email
    emailTaken: false, // is the entered email in our system?
    errors: null,
    fetching: false,
    isNonVIPCheckIn: false,
    isReturningCustomer: false,
    isSendMore: false,
    isVip: false,
    items: [],
    loginEmailRequested: false,
    order: null,
    refId: '',
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
    subtotal: 0,
    token: null,
    totalDiscount: 0,
    totalTax: 0,
    useStoredBillingInfo: false,
    useStoredPaymentInfo: false,
    useStoredShippingInfo: false,
    user: { ...userSettings },
  },
  getters: {
    grandTotal: (state: any) => {
      const itemCost = state.items.reduce((carry: number, item: Item) => carry + item.cost, 0)
      return Math.max(itemCost, 0)
    },
    userLoggedIn: (state: any) => state.user.username !== '',
    totalDiscount: (state: any) => 0,
    referDiscountEligible: (state: any) => state.subtotal >= 4000 && state.refId !== '',
    subtotal: (state: any) => state.items.reduce((carry: number, item: Item) => carry + item.cost, 0),
  },
  mutations: {
    addItem (state: any, item: Item) {
      state.items = [...state.items, item]
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
    loginEmailRequested (state: any) {
      state.loginEmailRequested = true
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
      console.log('setCartId', id)
      state.cartId = id
    },
    setCsrfToken (state: any, token: string) {
      state.csrfToken = token
    },
    setEmail (state: any, value: string) {
      state.email = value
    },
    setFetching (state: any, status: boolean) {
      state.fetching = status
    },
    setItems (state: any, items: Item[]) {
      state.items = items
    },
    setShipping (state: any, shipping: ServerShipping) {
      console.log('setShipping', shipping)
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
  },
  actions: {
    async fetchCart ({ commit }: Action) {
      commit('setFetching', true)
      const cartId = '5c0fd4f60d256a00046157b1'
      try {
        const cart = await fetch(`${host}/v2/cart?id=${cartId}`, {
          mode: 'cors',
          credentials: 'include',
        }).then(res => res.json())

        commit('setFetching', false)
        commit('setCartId', cart._id)
        commit('setEmail', cart.email)
        commit('setShippingAddress', cart.shippingAddress)
        commit('setBillingAddress', cart.billingAddress)
        commit('setItems', cart.bundles[0].skus)
        commit('setCsrfToken', cart.csrfToken)
        commit('setShipping', cart.shipping)
        commit('setTax', cart.totalTax)
        commit('setUser', cart.user)
      } catch (e) {
        console.error(e)
      }
    },
    async updateCart ({ commit, state }: Action) {
      commit('setFetching', true)
      try {
        const cart = await fetch(`${host}/v2/cart`, {
          method: 'PUT',
          mode: 'cors',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json', 'csrf-token': state.csrfToken },
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
      } catch (e) {
        // maybe there was a 401 or something?
        console.error(e)
        console.error('failed to updateCart')
      }
    },
    async fetchStock ({ commit }: Action) {
      commit('setFetching', true)
      const stock = await fetch(`${host}/v1/products`).then(res => res.json())
      commit('setStock', stock)
      commit('setFetching', false)
    },
    async checkUsername ({ commit }: Action, email: string) {
      try {
        const info = await fetch(`${host}/check-username`, {
          method: 'POST',
          mode: 'cors',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
          },
          body: `username=${encodeURIComponent(email)}`
        })
          .then(res => res.json())

        console.log(info)
      } catch (e) {
        console.error(e)
      }
    },
    async requestLoginEmail ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.idenify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      await fetch(`${host}/request-login-code`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'csrf-token': state.csrfToken },
        body: JSON.stringify({ username })
      })

      commit('loginEmailRequested')
    },
    async login ({ commit, state }: Action, { username, magicCode }: {username: string, magicCode: string}) {
      window.woopra && window.woopra.track('login-attempt', { username, code: magicCode })

      const info = await fetch(`${host}/login-existing`, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', 'csrf-token': state.csrfToken },
        body: JSON.stringify({ username, magicCode })
      }).then(res => res.json())

      if (info.loggedIn) {
        commit('setUser', info.user)
      } else {
        commit('loginFailure', 'the reason your login failed')
        window.woopra && window.woopra.track('login-failure', { username, info })
      }
    },
    async logout ({ commit }: Action) {
      await fetch(`${host}/logout-cart`, {
        mode: 'cors',
        credentials: 'include',
      }).then(res => {
        if (res.status < 400) {
          commit('logout')
        } else {
          commit('errorMessage', `Something went wrong while trying to log out. ${res.statusText}`)
        }
      })
    }
  }
}
