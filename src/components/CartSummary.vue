<template>
  <div class="root">
    <div class="box">
      <div v-if="items.length">
        <ul class="cart-items">
          <CartItem v-for="item in items" :key="item.sku" v-bind="item" />
        </ul>
        <div v-if="fetching" class="spinner-container">
          <Spinner />
        </div>
        <ul v-else class="totals" ref="totals">
          <li>
            <span>Order Subtotal</span>
            <span>${{ subtotal / 100 }}</span>
          </li>
          <li>
            <span>Shipping</span>
            <span>${{ postage }}</span>
          </li>
          <li v-if="credit > 0" class="discount">
            <span>Mr. Davis Rewards</span>
            <span>-${{ credit / 100 }}</span>
          </li>
          <li v-if="refId" class="discount refer-discount">
            <span>Discount</span>
            <span>-$10</span>
          </li>
          <p v-if="refId" class="refer-discount-conditions">applied at checkout to orders $40 or more with a new account</p>
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
      <div v-if="!items.length">
        <CartItemSkeleton v-if="fetching" />
        <div v-else class="empty-cart">Your cart is empty</div>
      </div>

      <ConfirmRecurringVIP v-if="returningVipCustomer && isVip" @updateRecurring="setCreateRecurringVIP" :makeRecurring="createRecurringVIP" class="confirm-recurring" />
      <VipToggle v-if="!returningVipCustomer" :isVip="isVip" @toggleVip="toggleVip" />

      <!-- a separate banner for returning VIP customers -->
      <Banner
        v-if="returningVipCustomer && !welcomeBackVipDismissed && !isVip"
        variant="brand"
        title="Welcome Back"
        @main="welcomeBackVipDismissed = true"
        class="welcome-back">
        <template v-slot:copy>
          We noticed that you've purchased a VIP from us before so we went ahead and gave you the VIP pricing. Thanks again!
        </template>
        <template v-slot:main>
          Dismiss
        </template>
      </Banner>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Banner from './BaseBanner.vue'
import Button from './BaseButton.vue'
import Dropdown from './BaseDropdown.vue'
import CartItem from './CartItem.vue'
import CartItemSkeleton from './CartItemSkeleton.vue'
import ConfirmRecurringVIP from './ConfirmRecurringVIP.vue'
import Spinner from './BaseSpinner.vue'
import VipToggle from './BaseVipToggle.vue'

const cart = namespace('cart')

@Component({
  components: { Banner, CartItem, CartItemSkeleton, Button, Dropdown, Spinner, ConfirmRecurringVIP, VipToggle },
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
  @cart.State credit: number
  @cart.State fetching: boolean
  @cart.State isVip: boolean
  @cart.State refId: string
  @cart.State returningVipCustomer: boolean
  @cart.State createRecurringVIP: boolean

  @cart.Getter grandTotal: number
  @cart.Getter subtotal: number

  @cart.Mutation setIsVip: any
  @cart.Mutation setSelectedShippingService: any
  @cart.Mutation setCreateRecurringVIP: () => void
  @cart.Action updateCart: () => Promise<void>
  @cart.Action fetchCart: () => Promise<void>
  @cart.Action fetchStock: () => Promise<void>

  welcomeBackVipDismissed: boolean = false

  async mounted () {
    await this.fetchStock()
    await this.fetchCart()

    if (window.innerWidth <= 850) {
      const totals = this.$refs['totals'] as HTMLElement
      totals.scrollIntoView({ behavior: 'smooth' })
    }
  }

  handleShippingServiceChange ($value: string) {
    this.setSelectedShippingService($value)
    this.updateCart()
  }

  toggleVip (isVip: boolean) {
    this.setIsVip(isVip)
    this.updateCart()
  }
}
</script>

<style scoped>
.box {
  background: #fff;
  padding: 1.5rem;
}

.continue-shopping {
  text-align: center;
}

.cart-items, .totals {
  padding: 0;
  margin-bottom: 0;
  margin-left: 0;
}

.totals {
  padding-top: 1rem;
  margin-bottom: 1rem;
}

.totals li {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
  color: #555;
  font-size: 1.25rem;
}

.totals li.discount {
  color: #5B7975;
}

.totals li.refer-discount {
  background-color: #dce8e7;
  padding: .25rem .5rem;
  margin: 0 -.5rem;
}

.totals .refer-discount + p {
  font-size: .75rem;
  margin: 0;
  padding: 0;
}

.spinner-container {
  height: 100px;
}

.empty-cart {
  text-align: center;
  color: #666;
  font-size: 2rem;
  margin-bottom: 1rem;
}

.confirm-recurring {
  margin-bottom: 1rem;
}
</style>
