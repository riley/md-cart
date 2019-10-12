<template>
  <div>
    <ul class="cart-items">
      <CartItem v-for="item in items" :key="item.sku" v-bind="item" />
    </ul>
    <div v-if="fetching" class="spinner-container">
      <Spinner />
    </div>
    <ul v-else class="totals">
      <li>
        <span>Order Subtotal</span>
        <span>${{ subtotal / 100 }}</span>
      </li>
      <li>
        <span>Shipping</span>
        <span>${{ postage }}</span>
      </li>
      <li v-if="discount > 0" class="discount">
        <span>Mr. Davis Rewards</span>
        <span>-${{ discount }}</span>
      </li>
      <li v-if="referDiscountEligible" class="discount">
        <span>Refer Discount</span>
        <span>-$10</span>
      </li>
      <li v-if="tax > 0">
        <span>Tax</span>
        <span>${{ tax }}</span>
      </li>
      <li class="grandTotal">
        <span>Total</span>
        <span>${{ grandTotal / 100 }}</span>
      </li>
    </ul>
    <Dropdown name="rates" :value="service" label="" :options="rates" @input="handleShippingServiceChange" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Dropdown from './BaseDropdown.vue'
import CartItem from './CartItem.vue'
import Spinner from './BaseSpinner.vue'

const cart = namespace('cart')

@Component({
  components: { CartItem, Dropdown, Spinner },
})
export default class CartSummary extends Vue {
  @Prop() stock!: Product[]

  @cart.State((state: any) => {
    return state.items.reduce((carry: Item[], item: Item) => {
      const existingSkuIndex = carry.findIndex(aggItem => aggItem.sku === item.sku)
      const product = state.stock.find((product: Product) => product.sku === item.sku)
      if (existingSkuIndex === -1) {
        carry.push({ ...product, quantity: 1, cost: item.cost })
      } else {
        carry[existingSkuIndex].quantity += item.quantity
        carry[existingSkuIndex].cost += item.cost
      }
      return carry
    }, [])
  }) items: Item[]
  @cart.State((state: any) => state.shipping.postage / 100) postage: number
  @cart.State((state: any) => {
    return state.shipping.rates.reduce((carry: any, rate: ShippingRate) => {
      carry[`${rate.service} - (${rate.est_delivery_days} days): ${rate.postage === 0 ? 'Free' : `$${rate.postage / 100}`}`] = rate.service
      return carry
    }, {})
  }) rates: {[s: string]: string}
  @cart.State((state: any) => state.shipping.service) service: string
  @cart.State((state: any) => state.totalTax / 100) tax: number
  @cart.State fetching: boolean

  @cart.Getter('totalDiscount') discount: number
  @cart.Getter referDiscountEligible: number
  @cart.Getter grandTotal: number
  @cart.Getter subtotal: number

  @cart.Mutation setSelectedShippingService: any
  @cart.Action updateCart: () => Promise<void>
  @cart.Action fetchCart: () => Promise<void>
  @cart.Action fetchStock: () => Promise<void>

  async mounted () {
    await this.fetchStock()
    this.fetchCart()
  }

  handleShippingServiceChange ($value: string) {
    this.setSelectedShippingService($value)
    this.updateCart()
  }
}
</script>

<style scoped>
.cart-items {
  padding: 0;
}

.totals {
  padding: 0;
}

.totals li {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
  color: #555;
}

.totals li.discount {
  color: #3f58fc;
}

.spinner-container {
  height: 100px;
}
</style>
