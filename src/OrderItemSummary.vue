<template>
  <div class="order-item-summary">
    <Item v-for="item in items" :key="item.sku" v-bind="item" />
    <ul class="totals">
      <li>
        <span>Order Subtotal</span>
        <span>${{ subtotal / 100 }}</span>
      </li>
      <li>
        <span>Shipping</span>
        <span>${{ postage / 100 }}</span>
      </li>
      <li v-if="discountBeforeReferralBonus > 0" class="discount">
        <span>Mr. Davis Rewards</span>
        <span>-${{ discountBeforeReferralBonus / 100 }}</span>
      </li>
      <li v-if="referDiscount" class="discount">
        <span>Refer Discount</span>
        <span>-$10</span>
      </li>
      <li v-if="totalTax > 0">
        <span>Tax</span>
        <span>${{ totalTax }}</span>
      </li>
      <li class="grandTotal">
        <span>Total</span>
        <span>${{ grandTotal / 100 }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import Item from './components/OrderItem.vue'

const order = namespace('order')
const cart = namespace('cart')

@Component({
  components: { Item }
})
export default class OrderItemSummary extends Vue {
  @cart.Action fetchStock: () => Promise<void>
  @order.Action fetchOrder: () => Promise<void>
  @order.Action fetchUserMeta: () => Promise<void>
  @order.Mutation missingIdError: any

  @cart.State stock: Product[]
  @order.Getter referDiscount: boolean
  @order.State bundles: Bundle[]
  @order.State grandTotal: number
  @order.State id: string
  @order.State orderLoadedOnce: boolean
  @order.State subtotal: number
  @order.State(state => state.shipping.postage) postage: number
  @order.Getter discountBeforeReferralBonus: number
  @order.State totalTax: number

  paymentMethod = 'visa'
  googleCheckoutTracked = false

  get items () {
    let items = []

    if (this.bundles.length === 0) return

    items = this.bundles[0].skus.reduce((carry: any[], item) => {
      const product = this.stock.find((product: Product) => product.sku === item.sku)
      const productIndex = carry.findIndex((fmtItem: Item) => fmtItem.sku === item.sku)
      if (productIndex === -1) {
        carry.push({ ...product, quantity: item.quantity, cost: item.cost })
      } else {
        carry[productIndex].quantity += item.quantity
        carry[productIndex].cost += item.cost
      }
      return carry
    }, [])

    return items
  }

  async mounted () {
    console.log('mounted', this.id)
    await this.fetchStock()
    if (this.id === null) {
      await this.fetchOrder()
      this.fetchUserMeta()
    }
  }

  updated () {
    if (this.orderLoadedOnce && this.stock.length) {
      window.woopra && window.woopra.track('checkout', {
        id: this.id,
        amount: (this.grandTotal / 100).toFixed(2),
        time: Date.now(),
        category: 'undershirts',
        type: this.bundles.some((bundle: Bundle) => bundle.isVip) ? 'vip' : 'standard'
      })

      window.gtag('event', 'purchase', {
        currency: 'USD',
        value: (this.grandTotal / 100).toFixed(2),
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

      window.fbq && window.fbq('track', 'Purchase', { value: (this.grandTotal / 100).toFixed(2), currency: 'USD' })
    }
  }
}
</script>

<style scoped>
.order-item-summary {
  padding: 1rem;
  max-width: 30rem;
  background-color: rgba(0, 0, 0, .07);
}

.totals {
  padding: 0;
  margin: 1rem 0 0;
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
</style>
