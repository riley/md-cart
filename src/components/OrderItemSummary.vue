<template>
  <div class="order-item-summary">
    <div class="palette">
      <Item v-for="item in items" :key="item.sku" v-bind="item" />
      <div v-if="recurringPrice">
        <p class="recurring-notification"><strong>{{ recurringItems.length }}x</strong> recurring every 60 days ${{ recurringPrice / 100 }}</p>
        <ul class="recurring-items">
          <li v-for="item in recurringItems" :key="item.sku">
            {{ item.quantity }}x {{ item.title }}
          </li>
        </ul>
      </div>
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
        <li v-if="referralError" class="referralError">
          <span>{{ referralError }}</span>
        </li>
        <li v-if="totalTax > 0">
          <span>Tax</span>
          <span>${{ totalTax / 100 }}</span>
        </li>
        <li class="grandTotal">
          <span>Total</span>
          <span>${{ grandTotal / 100 }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import Item from './OrderItem.vue'

const order = namespace('order')
const cart = namespace('cart')

@Component({
  components: { Item }
})
export default class OrderItemSummary extends Vue {
  @cart.Action fetchStock: () => Promise<void>
  @order.Action fetchOrder: () => Promise<any>
  @order.Action fetchUserMeta: () => Promise<void>
  @order.Mutation missingIdError: any

  @cart.State stock: Product[]
  @order.Getter referDiscount: boolean
  @order.State bundles: Bundle[]
  @order.State email: string
  @order.State estimatedDeliveryDate: Date
  @order.State grandTotal: number
  @order.State id: string
  @order.State orderLoadedOnce: boolean
  @order.State referralError: string
  @order.State(state => state.shipping.address) shippingAddress: Address
  @order.State subtotal: number
  @order.State(state => state.shipping.postage) postage: number
  @order.Getter discountBeforeReferralBonus: number
  @order.State totalTax: number

  paymentMethod: string = 'visa'
  checkoutTracked: boolean = false

  get items () {
    return this.getItems(false)
  }

  get recurringItems () {
    return this.getItems(true)
  }

  get recurringPrice () {
    return this.bundles && this.bundles[0] ? this.bundles[0].recurringPrice : 0
  }

  getItems (recurring: boolean) {
    let items = []
    const set = recurring ? 'recurringSkus' : 'skus'

    if (this.bundles.length === 0) return

    items = this.bundles[0][set].reduce((carry: any[], item) => {
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
    await this.fetchStock()
    if (this.id === null) {
      await this.fetchOrder()
      this.fetchUserMeta()
    }

    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(threeDaysFromNow.getDate() + 3)
    const ed = new Date(this.estimatedDeliveryDate || threeDaysFromNow)
    const fmtDeliveryDate = `${ed.getFullYear()}-${(ed.getMonth() + 1).toString().padStart(2, '0')}-${ed.getDate().toString().padStart(2, '0')}`

    const orderSummary = this
    const onlyMasks = this.bundles[0].skus.every((item: Item) => item.clothingType === 'covid-mask')

    if (onlyMasks) return

    window.gapi.load('surveyoptin', function () {
      const payload = {
        'merchant_id': 111805534,
        'order_id': orderSummary.id,
        'email': orderSummary.email,
        'delivery_country': orderSummary.shippingAddress.country,
        'estimated_delivery_date': fmtDeliveryDate,
        'products': orderSummary.bundles[0].skus.reduce((carry: any[], item: Item) => {
          const product = orderSummary.stock.find((p: Product) => p.sku === item.sku)
          if (product) {
            carry.push({ gtin: product.gtin12 })
          }
          return carry
        }, [])
      }
      window.gapi.surveyoptin.render(payload)
    })
  }

  updated () {
    if (this.orderLoadedOnce && this.stock.length && !this.checkoutTracked) {
      window.woopra && window.woopra.track('checkout', {
        id: this.id,
        amount: (this.grandTotal / 100).toFixed(2),
        time: Date.now(),
        category: 'undershirts',
        type: this.bundles.some((bundle: Bundle) => bundle.isVip) ? 'vip' : 'standard'
      })

      window.gtag('config', process.env.VUE_APP_GA_ID)

      /* eslint-disable camelcase */
      window.enhanced_conversion_data = {
        email: this.email,
        first_name: this.shippingAddress.name,
        home_address: {
          street: `${this.shippingAddress.address_1} ${this.shippingAddress.address_2}`,
          city: this.shippingAddress.city,
          region: this.shippingAddress.state,
          postal_code: this.shippingAddress.zip,
          country: this.shippingAddress.country,
        }
      }
      /* eslint-enable camelcase */

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

      const contents: Item[] = []
      const groupedBySku = this.bundles[0].skus.reduce((carry, item) => {
        const index = carry.findIndex(p => p.sku === item.sku)
        if (index === -1) {
          carry.push({ ...item })
        } else {
          carry[index].quantity += item.quantity
        }
        return carry
      }, contents)

      if (window.fbq) {
        window.fbq && window.fbq('track', 'Purchase', {
          value: (this.grandTotal / 100).toFixed(2),
          content_ids: this.bundles[0].skus.map(item => item.sku).join(),
          num_items: this.bundles[0].skus.length,
          content_type: 'product',
          contents: groupedBySku.map(item => ({ id: item.sku, quantity: item.quantity })),
          product_catalog_id: 465548217719062,
          currency: 'USD',
        })

        if (this.bundles[0].isVip) {
          window.fbq('track', 'Subscribe')
        }
      }

      window.obApi && window.obApi('track', 'Purchase', {
        orderValue: (this.grandTotal / 100).toFixed(2),
        currency: 'USD',
        orderId: this.id
      })

      this.checkoutTracked = true
    }
  }
}
</script>

<style scoped>
.palette {
  background: white;
  padding: 1rem;
}

.recurring-notification {
  background: #5C7975;
  color: white;
  margin: 0;
  padding: .5rem 1rem;
}

.recurring-items {
  margin: 0 0 1rem 0;
  padding: 0;
  background: #efefef;
}

.recurring-items li {
  border-bottom: 1px solid #ccc;
  list-style: none;
  padding: .5rem 1rem;
}

.totals {
  padding: 0;
  margin: 1rem 0 0;
}

.totals li {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
  font-size: 1.25rem;
  color: #555;
}

.totals li.discount {
  color: #3f58fc;
}

.referralError {
  background-color: #fbd9a6;
  color: white;
  font-weight: 500;
  padding: .5rem 1rem;
  margin: .5rem -.25rem;
  list-style: none;
}
</style>
