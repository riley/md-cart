<template>
  <div class="root">
    <div class="box">
      <div v-if="items.length">
        <ul class="cart-items" ref="cart-items">
          <Item v-for="item in items" :key="item.sku" v-bind="item" @increment="incrementItem" :fetching="fetching" />
        </ul>
        <div v-if="fetching" class="spinner-container">
          <Spinner />
        </div>
        <p class="save-percent-upsell">Add one more item & save {{ Math.floor(pricing.nextDiscount * 100) }}% on your order. <span v-if="!isVip && subtotal < freeShippingThreshold" class="free-shipping-upsell">Free US Shipping on orders $29+.</span></p>
        <ul v-if="!fetching" class="totals" ref="totals">
          <li>
            <span>Full Price</span>
            <span>${{ basePrice / 100 }}</span>
          </li>
          <li v-if="subtotal !== basePrice">
            <span>Discount</span>
            <span><span class="discount-percent">Saving {{ Math.floor(discount * 100) }}%</span> -${{ Math.abs(subtotal - basePrice) / 100 }}</span>
          </li>
          <li>
            <span>Shipping</span>
            <span>{{ postage ? `$${postage}` : 'Free' }}</span>
          </li>
          <li v-if="credit > 0" class="discount">
            <span>Mr. Davis Rewards</span>
            <span>-${{ credit / 100 }}</span>
          </li>
          <li v-if="refId && referDiscountEligible" class="discount">
            <span>Welcome Discount</span>
            <span>-$10</span>
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
          <li v-if="refId && !referDiscountEligible" class="discount refer-discount">
            <p class="discount-conditions">$10 discount applies for new customers on orders of $40 or more</p>
          </li>
        </ul>
        <Dropdown name="rates" :value="service" label="" :options="rates" @input="handleShippingServiceChange" />
      </div>
      <div v-if="!items.length">
        <CartItemSkeleton v-if="fetching" />
        <div v-else class="empty-cart">Your cart is empty</div>
      </div>

      <ConfirmRecurringVIP v-if="isActiveVip && isVip" @updateRecurring="setRecurring" :makeRecurring="createNewVIP" class="confirm-recurring" />
      <!-- <VipToggle v-if="!isActiveVip" :isVip="isVip" @toggleVip="toggleVip" /> -->

      <!-- a separate banner for returning VIP customers -->
      <Banner
        v-if="isActiveVip && !welcomeBackVipDismissed && !isVip"
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
import Pricing from '@/utils/Pricing'

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
  @cart.State basePrice: number
  @cart.State createNewVIP: boolean
  @cart.State credit: number
  @cart.State discount: number
  @cart.State fetching: boolean
  @user.State isActiveVip: boolean
  @cart.State isVip: boolean
  @cart.State isNonVIPCheckIn: boolean
  @cart.State isReturningCustomer: boolean
  @cart.State pricing: Pricing
  @cart.State refId: string
  @cart.State subtotal: number

  @cart.Getter grandTotal: number
  @cart.Getter referralCredit: number
  @cart.Getter nonVIPCheckInCredit: number
  @cart.Getter referDiscountEligible: boolean
  @cart.Getter nonVipDiscountEligible: boolean

  @cart.Mutation addItem: any
  @cart.Mutation removeItem: any
  @cart.Mutation setIsVip: any
  @cart.Mutation setSelectedShippingService: any
  @cart.Mutation setCreateNewVip: (createNewVip: boolean) => void
  @cart.Action updateCart: () => Promise<void>
  @cart.Action fetchCart: () => Promise<void>
  @cart.Action fetchStock: () => Promise<void>
  @user.Action fetchUser: () => Promise<void>

  freeShippingThreshold: number = 2900
  welcomeBackVipDismissed: boolean = false

  async mounted () {
    await this.fetchStock()
    await this.fetchCart()
    await this.fetchUser()

    if (window.innerWidth <= 850) {
      const list = this.$refs['cart-items'] as HTMLElement
      list.lastElementChild?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  handleShippingServiceChange ($value: string) {
    this.setSelectedShippingService($value)
    this.updateCart()
  }

  setRecurring (isVip: boolean) {
    this.setCreateNewVip(isVip)
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
  padding: 0 1rem;
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
  margin-bottom: .5rem;
}

.totals li {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
  color: #555;
  font-size: 1rem;
}

.totals li.discount {
  color: #5b7975;
  background-color: rgba(220,232,221,1);
  padding: .25rem .5rem;
  margin: .5rem -.5rem;
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

.discount-percent {
  border: 1px solid #333;
  font-size: .9rem;
  border-radius: 3px;
  padding: .5rem;
  margin-right: .5rem;
}

.discount-conditions {
  font-size: .85rem;
  margin: 0;
  padding: .5rem 1rem !important;
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

.save-percent-upsell {
  color: rgba(210, 92, 74, .8);
  text-align: right;
  padding-bottom: 0;
  font-size: .9rem;
}

.free-shipping-upsell {
  text-decoration: underline;
}

.md__dropdown-field-wrapper {
  margin-bottom: 0;
}

@media (min-width: 850px) {
  .box {
    padding: 1.5rem;
  }

  .save-percent-upsell {
    font-size: 1rem;
  }

  .totals li {
    font-size: 1.25rem;
  }
}
</style>
