import { setToken, unsetToken } from '../utils/storage'
import { identifyTrack } from '../utils/tracking'
import { makeFetch } from '../utils/network'

export default {
  namespaced: true,
  state: {
    _id: null,
    billing: {
      address: null
    },
    cardMeta: {
      lastFour: '',
      expMonth: '',
      expYear: ''
    },
    credit: 0,
    failedToFetchUser: true,
    isReturningCustomer: false,
    isActiveVip: false,
    loginEmailRequested: false,
    loginErrorMessage: '',
    paypalPayerId: null,
    pricingTier: 2,
    refId: '',
    shipping: {
      address: null,
    },
    stripeId: null,
    stripeToken: null,
    userLoginFailed: null,
    username: null
  },
  getters: {
    loggedIn: (state: any) => {
      return !!state._id
    }
  },
  mutations: {
    loginEmailRequested (state: any, requested: boolean) {
      state.loginEmailRequested = requested
    },
    loginFailure (state: any, message: string) {
      state.loginErrorMessage = message
    },
    logout (state: any) {
      // used in the cart and admin. clear out user settings
      state._id = null
      state.billing = { address: null }
      state.cardMeta = {}
      state.credit = 0
      state.loginEmailRequested = false
      state.loginErrorMessage = false
      state.refId = ''
      state.shipping = { address: null }
      state.username = null
      unsetToken()
    },
    setAddress (state: any, { location, field, value }: {location: string, field: string, value: string}) {
      state[location].address[field] = value
    },
    setReturningCustomer (state: any, returning: boolean) {
      state.isReturningCustomer = returning
    },
    setIsActiveVip (state: any, returning: boolean) {
      state.isActiveVip = returning
    },
    setStripeToken (state: any, token: StripeToken) {
      state.stripeToken = token
    },
    setUser (state: any, user: StoredUser) {
      state._id = user._id
      state.username = user.username
      state.billing.address = user.billingAddress
      state.shipping.address = user.shippingAddress
      state.cardMeta = user.cardMeta
      state.credit = user.credit
      state.paypalPayerId = user.paypalPayerId
      state.pricingTier = user.pricingTier
      state.refId = user.refId
      state.stripeId = user.stripeId
      state.isReturningCustomer = user.orders.length > 0
      state.isActiveVip = user.isActiveVip

      window.woopra && window.woopra.identify({
        email: user.username,
        name: user.shippingAddress.name
      })
      window.woopra && window.woopra.track()
    },
    setUserFailedToFetch (state: any, failure: boolean) {
      state.failedToFetchUser = failure
    },
    setUserLoginFailed (state: any, status: boolean) {
      state.userLoginFailed = status
    },
    setUsername (state: any, username: string) {
      state.username = username
    },
  },
  actions: {
    async fetchUser ({ commit, dispatch }: Action) {
      try {
        const response = await makeFetch('/api/user')

        commit('userLoginFailed', response.status !== 200)

        if (response.status !== 200) return

        const user = await response.json()

        commit('setUser', user)
        commit('cart/login', user, { root: true })
        // might need to calculate sales tax now that we know the shipping address
        console.log('update cart from user module')
        dispatch('cart/updateCart', null, { root: true })
        console.log('setUserFailedToFetch to false')
        commit('setUserFailedToFetch', false)
        return true
      } catch (e) {
        console.error(e)
        commit('setUserFailedToFetch', true)
        return false
      }
    },
    async requestLoginEmail ({ commit, state }: Action, username: string) {
      window.woopra && window.woopra.identify({ email: username })
      window.woopra && window.woopra.track('request-login-code', { username })

      try {
        await makeFetch('/api/request-login-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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
    async login ({ commit, dispatch }: Action, { username, magicCode }: {username: string, magicCode: string}) {
      window.woopra && window.woopra.track('login-attempt', { username, code: magicCode })
      let info

      try {
        info = await makeFetch('/api/login-existing', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, magicCode })
        }).then(response => response.json())
      } catch (e) {
        commit('loginFailure', 'Something went wrong with our login service. Please try again in a few minutes, or contact us at <a href="mailto:support@mrdavis.com">support@mrdavis.com</a>. Sorry for the trouble.')
        return 'failure'
      }

      if (info.cart) {
        console.log('user module setting cart', info.cart)
        commit('cart/setIsVip', info.cart.bundles[0].isVip, { root: true })
        commit('cart/setDiscount', info.cart.bundles[0].discount, { root: true })
        commit('cart/setItems', info.cart.bundles[0].skus, { root: true })
        commit('cart/setShipping', info.cart.shipping, { root: true })
        commit('cart/setCredit', info.cart.priceModification.userCredit.amount + info.cart.priceModification.ks.amount, { root: true })
        commit('cart/setPricingTier', info.cart.pricingTier, { root: true })
        commit('cart/setCreateNewVip', info.cart.createNewVip, { root: true })
        commit('cart/setSubtotal', info.cart.subtotal, { root: true })
        commit('cart/setTax', info.cart.totalTax, { root: true })
      }

      if (info.token) {
        commit('setUser', info.user)
        setToken(info.token)
        commit('cart/login', info.user, { root: true })
        commit('cart/toggleLoginForm', false, { root: true })
        commit('toggleLoginForm', false, { root: true }) // this is the admin store...sometimes?
        identifyTrack({ email: info.user.username, name: info.user.shippingAddress.name })

        if (window.location.pathname === '/user' && info.user?.vips?.length > 0) {
          console.log('redirecting to vip page')
        }

        return 'success'
      } else {
        commit('loginFailure', info.error)
        window.woopra && window.woopra.track('login-failure', { username, message: info.error })
        return 'failure'
      }
    },
    async logout ({ commit, state }: Action) {
      commit('logout')

      commit('vip/logout', null, { root: true })
      commit('order/logout', null, { root: true })
      commit('cart/logout', null, { root: true })

      const response = await makeFetch('/api/logout', { method: 'POST', })
      const { token, cart } = await response.json()

      if (cart) {
        console.log('user module setting cart: logout', cart)
        commit('cart/setIsVip', cart.bundles[0].isVip, { root: true })
        commit('cart/setItems', cart.bundles[0].skus, { root: true })
        commit('cart/setShipping', cart.shipping, { root: true })
        commit('cart/setCredit', cart.priceModification.userCredit.amount + cart.priceModification.ks.amount, { root: true })
        commit('cart/setDiscount', cart.bundles[0].discount, { root: true })
        commit('cart/setPricingTier', cart.pricingTier, { root: true })
        commit('cart/setCreateNewVip', cart.createNewVip, { root: true })
        commit('cart/setSubtotal', cart.subtotal, { root: true })
        commit('cart/setTax', cart.totalTax, { root: true })
      }

      setToken(token)
    },
    async update ({ commit, state }: Action) {
      const response = await makeFetch('/api/user', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stripeToken: state.stripeToken,
          username: state.username,
          billingAddress: state.billing.address,
          shippingAddress: state.shipping.address,
        }),
      }).then(res => res.json())

      console.log('patched user', response)

      if (response.message) {
        throw new Error(response.message)
      }

      const { user, token } = response

      // how do we handle errors?
      // billing errors?
      // invalid address?

      commit('setUser', user)
      setToken(token)
    }
  }
}
