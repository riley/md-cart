<template>
  <div class="root">
    <div class="box">
      <div v-if="items.length">
        <ul class="cart-items">
          <Item v-for="item in items" :key="item.sku" v-bind="item" @increment="incrementItem" :fetching="fetching" />
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
            <div>
              <div v-if="referDiscountEligible" class="discount-amount">
                <span>Discount</span>
                <span>-${{ referralCredit / 100 }}</span>
              </div>
              <p class="discount-conditions">$10 discount applies for new customers on orders of $40 or more</p>
            </div>
          </li>
          <li v-if="nonVipDiscountEligible" class="discount">
            <span>Secret Savings</span>
            <span>-${{ nonVIPCheckInCredit / 100 }}</span>
          </li>
          <p v-if="isNonVIPCheckIn" class="discount-conditions">$10 secret savings discount applies for orders of $50 or more</p>
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
      <!-- <VipToggle v-if="!returningVipCustomer" :isVip="isVip" @toggleVip="toggleVip" /> -->

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
import Banner from '../BaseBanner.vue'
import Button from '../BaseButton.vue'
import Dropdown from '../BaseDropdown.vue'
import Item from '../ItemListItem.vue'
import CartItemSkeleton from './CartItemSkeleton.vue'
import ConfirmRecurringVIP from './ConfirmRecurringVIP.vue'
import Spinner from '../BaseSpinner.vue'
import VipToggle from './BaseVipToggle.vue'

const cart = namespace('cart')
const user = namespace('user')

@Component({
  components: { Banner, Item, CartItemSkeleton, Button, Dropdown, Spinner, ConfirmRecurringVIP, VipToggle },
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
  @cart.State isNonVIPCheckIn: boolean
  @cart.State refId: string
  @cart.State isReturningCustomer: boolean
  @user.State returningVipCustomer: boolean
  @cart.State createRecurringVIP: boolean

  @cart.Getter grandTotal: number
  @cart.Getter subtotal: number
  @cart.Getter referralCredit: number
  @cart.Getter nonVIPCheckInCredit: number
  @cart.Getter referDiscountEligible: boolean
  @cart.Getter nonVipDiscountEligible: boolean

  @cart.Mutation addItem: any
  @cart.Mutation removeItem: any
  @cart.Mutation setIsVip: any
  @cart.Mutation setSelectedShippingService: any
  @cart.Mutation setCreateRecurringVIP: () => void
  @cart.Action updateCart: () => Promise<void>
  @cart.Action fetchCart: () => Promise<void>
  @cart.Action fetchStock: () => Promise<void>
  @user.Action fetchUser: () => Promise<void>

  welcomeBackVipDismissed: boolean = false

  async mounted () {
    await this.fetchStock()
    await this.fetchCart()
    await this.fetchUser()

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

  incrementItem ({ amount, sku }: { amount: number, sku: string }) {
    if (this.fetching) return

    const item = this.items.find((item: Item) => item.sku === sku)

    if (!item) return // this should probably never happen

    if (amount < item.quantity) {
      this.removeItem(sku)
    } else {
      this.addItem(sku)
    }

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
  display: block;
}

.totals li.refer-discount {
  padding: .125rem;
  background: rgba(220,232,221,1);
  margin: .5rem 0;
  border-radius: 4px;
}

.totals li.refer-discount > div {
  padding: .25rem .5rem;
  border-radius: 4px;
}

.discount-amount {
  display: flex;
  justify-content: space-between;
}

.discount-conditions {
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
