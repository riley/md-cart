import { setToken } from '../utils/storage'
import { identifyTrack } from '../utils/tracking'
import { makeFetch } from '../utils/network'

export default {
  namespaced: true,
  state: {
    _id: null,
    billing: {
      address: null
    },
    cardMeta: null,
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
      state.refId = ''
      state.shipping = { address: null }
      state.username = null
    },
    setReturningCustomer (state: any, returning: boolean) {
      state.isReturningCustomer = returning
    },
    setReturningVipCustomer (state: any, returning: boolean) {
      state.returningVipCustomer = returning
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
    setUsername (state: any, username: string) {
      state.username = username
    },

    setAddress (state: any, { location, field, value }: {location: string, field: string, value: string}) {
      state[location].address[field] = value
    },
    setUserFailedToFetch (state: any, failure: boolean) {
      state.failedToFetchUser = failure
    }
  },
  actions: {
    async fetchUser ({ commit }: Action) {
      try {
        const response = await makeFetch('/api/user')

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
        return info.user
      } else {
        commit('loginFailure', info.error)
        window.woopra && window.woopra.track('login-failure', { username, message: info.error })
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
      const { user, token } = await makeFetch('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
          username: state.username,
          billingAddress: state.billing.address,
          shippingAddress: state.shipping.address,
        }),
      }).then(res => res.json())

      commit('setUser', user)
      setToken(token)
    }
  }
}
