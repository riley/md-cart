/**
 * this store represents a VIP that is currently being displayed/modified
 */
import { makeFetch } from '../utils/network'

export default {
  namespaced: true,
  state: {
    _id: null,
    cycleDays: 0,
    items: [],
    nextDelivery: null,
    pricingTier: 2,
    status: null,
    vipPrice: 0,
  },
  mutations: {
    addItem (state: any, item: Item) {
      state.items = [...state.items, item]
    },
    logout: (state: any) => {
      state._id = null
      state.cycleDays = 0
      state.items = []
      state.nextDelivery = null
      state.pricingTier = 2
      state.status = null
      state.vipPrice = 0
    },
    removeItem (state: any, sku: string) {
      const index = state.items.findIndex((item: Item) => item.sku === sku)
      state.items.splice(index, 1)
      state.items = [...state.items]
    },
    setCycleDays (state: any, cycleDays: number) {
      state.cycleDays = cycleDays
    },
    setNextDelivery (state: any, nextDelivery: Date) {
      state.nextDelivery = nextDelivery
    },
    setItems (state: any, items: Item[]) {
      state.items = items
    },
    setStatus (state: any, status: string) {
      state.status = status
    },
    setVip (state: any, vip: VIP) {
      console.log('vip setVip', vip)
      state._id = vip._id
      state.createdAt = vip.createdAt
      state.cycleDays = vip.cycleDays
      state.items = vip.items
      state.nextDelivery = vip.nextDelivery
      state.status = vip.status
      state.vipPrice = vip.vipPrice
    }
  },
  actions: {
    // this does not update all vips, just one at a time
    async updateVip ({ commit, state }: Action) {
      const payload = {
        _id: state._id,
        cycleDays: state.cycleDays,
        items: state.items,
        nextDelivery: state.nextDelivery,
        pricingTier: state.pricingTier,
        status: state.status,
        vipPrice: state.vipPrice
      }
      const vip = await makeFetch(`/api/vip/${state._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      }).then(res => res.json())

      console.log('vip updateVip', vip)

      vip.createdAt = new Date(vip.createdAt)
      vip.nextDelivery = new Date(vip.nextDelivery)

      commit('setVip', vip)
      commit('setVip', vip, { root: true })
    }
  }
}
