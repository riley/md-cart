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
    returningVipCustomer: false,
    loginEmailRequested: false,
    loginErrorMessage: '',
    paypalPayerId: null,
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
      return !!state.username
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
      state.cardMeta = null
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
    setReturningVipCustomer (state: any, returning: boolean) {
      state.returningVipCustomer = returning
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
      state.refId = user.refId
      state.stripeId = user.stripeId
      state.isReturningCustomer = user.orders.length > 0
      state.returningVipCustomer = user.vips.length > 0

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
    async fetchUser ({ commit }: Action) {
      try {
        const response = await makeFetch('/api/user')

        commit('userLoginFailed', response.status !== 200)

        if (response.status !== 200) return

        const user = await response.json()

        commit('setUser', user)
        commit('cart/loginCart', user, { root: true })
        commit('setUserFailedToFetch', false)
      } catch (e) {
        console.error(e)
        commit('setUserFailedToFetch', true)
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
        return
      }

      if (info.token) {
        commit('setUser', info.user)
        commit('cart/loginCart', info.user, { root: true })
        commit('toggleLoginForm', false, { root: true })
        identifyTrack({ email: info.user.username, name: info.user.shippingAddress.name })
        setToken(info.token)
        return true
      } else {
        commit('loginFailure', info.error)
        window.woopra && window.woopra.track('login-failure', { username, message: info.error })
        return false
      }
    },
    async logout ({ commit, state }: Action) {
      commit('logout')

      commit('cart/logoutCart', null, { root: true })

      const response = await makeFetch('/api/logout-cart', { method: 'POST', })
      const token = await response.text()

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
