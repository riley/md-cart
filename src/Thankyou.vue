<template>
  <div>
    <div v-if="orderError">{{ orderError }}</div>
    <div v-if="fetching" class="order-fetching">
      <Spinner />
    </div>
    <div v-if="orderLoadedOnce" id="order-summary" class="order-summary">
      <div class="customer-summary">
        <div class="thank-you-callout">
          <div class="check-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          order {{ id }}<br>
        </div>
        <h3>Thank you {{ billing.name.trim() }}!</h3>
        <Card class="status-card">
          <ShipStatus
            :createdAt="createdAt"
            :status="status"
            :address="shipping" />
        </Card>
        <Card class="update-card">
          <CardContent>
            <h2>Order Updates</h2>
            <p class="update-copy">You'll get shipping and delivery updates via email</p>
          </CardContent>
        </Card>
        <Card class="refer-prompt">
          <CardContent>
            <ReferPrompt :id="userRefId" />
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <CustomerInfo
              :email="email"
              :shippingMethod="shippingMethod"
              :paymentMethod="paymentMethod"
              :shipping="shipping"
              :billing="billing"/>
          </CardContent>
        </Card>
        <p>
          Need help? <a href="mailto:support@mrdavis.com">Contact us</a>
          <Button @click="continueShopping" position="right">Continue Shopping</Button>
        </p>
      </div>
      <ItemSummary
        class="item-summary"
        :bundle="bundles[0]"
        :discount="discountBeforeReferralBonus"
        :grandTotal="grandTotal"
        :postage="postage"
        :referDiscount="referDiscount"
        :stock="stock"
        :subtotal="subtotal" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Action, namespace } from 'vuex-class'
import Spinner from './components/BaseSpinner.vue'
import Button from './components/BaseButton.vue'
import Card from './components/BaseCard.vue'
import CardContent from './components/BaseCardContent.vue'
import ItemSummary from './components/OrderItemSummary.vue'
import ReferPrompt from './components/ReferPrompt.vue'
import ShipStatus from './components/ShipStatus.vue'
import CustomerInfo from './components/CustomerInfo.vue'

const cart = namespace('cart')
const order = namespace('order')

@Component({
  components: {
    Spinner,
    ItemSummary,
    CustomerInfo,
    ShipStatus,
    Card,
    CardContent,
    Button,
    ReferPrompt,
  }
})
export default class Thankyou extends Vue {
  @cart.Action fetchStock: () => Promise<void>
  @cart.State stock: Product[]

  @order.Action fetchOrder: () => Promise<void>
  @order.Action fetchUserMeta: () => Promise<void>
  @order.Mutation missingIdError: any
  @order.State(state => state.billing.address) billing: Address
  @order.State bundles: Bundle[]
  @order.State createdAt: Date
  @order.State email: string
  @order.State fetching: string
  @order.State grandTotal: number
  @order.State id: string
  @order.State orderError: string
  @order.State orderLoadedOnce: boolean
  @order.State(state => state.shipping.postage) postage: number
  @order.Getter referDiscount: boolean
  @order.State userRefId: string
  @order.State(state => state.shipping.address) shipping: Address
  @order.State(state => state.shipping.service) shippingMethod: string
  @order.State status: string
  @order.State subtotal: number
  @order.Getter discountBeforeReferralBonus: number
  @order.State totalPrice: number
  @order.State totalTax: number

  paymentMethod = 'visa'
  googleCheckoutTracked = false

  async mounted () {
    await this.fetchStock()
    if (this.id === null) {
      this.missingIdError()
    } else {
      await this.fetchOrder()
      this.fetchUserMeta()
    }
  }

  updated () {
    if (this.orderLoadedOnce && this.stock.length) {
      window.woopra && window.woopra.track('checkout', {
        id: this.id,
        amount: (this.totalPrice / 100).toFixed(2),
        time: Date.now(),
        category: 'undershirts',
        type: this.bundles.some((bundle: Bundle) => bundle.isVip) ? 'vip' : 'standard'
      })

      window.gtag('event', 'purchase', {
        currency: 'USD',
        value: (this.totalPrice / 100).toFixed(2),
        transaction_id: this.id,
        tax: (this.totalTax / 100).toFixed(2),
        shipping: (this.postage / 100).toFixed(2),
        items: this.bundles[0].skus.reduce((carry: GoogleAnalyticsConversionItem[], item: Item) => {
          const itemIndex = carry.findIndex(i => i.id === item.sku)
          const product = this.stock.find(p => p.sku === item.sku)

          if (itemIndex === -1 && product) {
            carry.push({
              id: item.sku,
              name: product.title,
              list_name: 'Order Items',
              brand: 'Mr. Davis',
              category: item.clothingType,
              variant: product.color,
              quantity: 1,
              price: (item.cost / 100).toFixed(2)
            })
          } else {
            carry[itemIndex].price = (parseFloat(carry[itemIndex].price) + item.cost / 100).toFixed(2)
          }
          return carry
        }, [])
      })

      window.fbq && window.fbq('track', 'Purchase', { value: (this.totalPrice / 100).toFixed(2), currency: 'USD' })
    }
  }

  continueShopping () {
    location.href = 'https://mrdavis.com'
  }
}
</script>

<style scoped>
h2 {
  margin-top: 0;
}

.thank-you-callout {
  display: flex;
  align-items: center;
}

.check-wrapper {
  border: 1px solid #1976d2;
  border-radius: 15px;
  display: inline-flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-right: .75rem;
}

.check-wrapper svg {
  fill: #1976d2;
}

.order-summary {
  display: flex;
}

.update-card, .status-card, .refer-prompt {
  margin-bottom: 1rem;
}

.update-copy {
  margin-bottom: 0;
}

@media (max-width: 800px) {
  .item-summary {
    order: -1;
  }
}

.order-fetching {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
