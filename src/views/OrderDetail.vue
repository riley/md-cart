<template>
  <div v-if="loggedIn && _id" id="order-detail">
    <button class="order-history-nav" @click="navToOrderHistory">← Back to Order List</button>
    <Heading>Order Detail</Heading>
    <Card>
      <section>
        <div class="info-row">
          <p>Status: {{ order.status }}</p>
        </div>
      </section>
      <section class="grouped-items">
        <ItemRow class="grouped-item" v-for="item of groupedItems" :key="item.sku" :item="item" />
        <div class="proceed-to-checkout">
          <p>{{ cta }}</p>
          <Button inline @click="reorder">Proceed to Checkout</Button>
          <Button inline variant="plain" href="https://mrdavis.com/returns">Initiate Return</Button>
        </div>
      </section>
      <section>
        <div class="info-row">
          <p>Order id</p>
          <p>{{ order.id }}</p>
        </div>
        <div class="info-row">
          <p>Order Placed</p>
          <p>{{ formattedDate(order.createdAt) }}</p>
        </div>
        <div class="info-row">
          <p>Order Total</p>
          <p>${{ order.totalPrice / 100 }}</p>
        </div>
        <div class="info-row">
          <p>Ship To</p>
          <Address v-bind="order.shippingAddress" />
        </div>
        <div class="info-row">
          <p>Bill To</p>
          <Address v-bind="order.billingAddress" />
        </div>
      </section>
      <section>
        <div class="info-row">
          <p>Subtotal <span>({{ order.bundles[0].skus.length }} Items)</span></p>
          <p>${{ order.subtotal / 100 }}</p>
        </div>
        <div v-if="order.totalDiscount > 0" class="info-row">
          <p>Mr. Davis Credits</p>
          <p>-${{ order.totalDiscount }}</p>
        </div>
        <div class="info-row">
          <p>Shipping</p>
          <p>${{ order.shipping.postage / 100 }}</p>
        </div>
        <div class="info-row">
          <p>Sales Tax</p>
          <p>${{ order.totalTax / 100 }}</p>
        </div>
        <div class="info-row">
          <p>Order Total (USD)</p>
          <p>${{ order.totalPrice / 100 }}</p>
        </div>
      </section>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Prop, Component } from 'vue-property-decorator'
import { State, Action, namespace } from 'vuex-class'
import Card from '@/components/BaseCard.vue'
import Address from '@/components/BaseAddress.vue'
import Heading from '@/components/BaseHeading.vue'
import Button from '@/components/BaseButton.vue'
import ItemRow from '@/components/admin/ItemRow.vue'

const cart = namespace('cart')
const order = namespace('order')
const user = namespace('user')

@Component({ components: { Address, Button, Card, Heading, ItemRow } })
export default class OrderDetail extends Vue {
  @Prop() id: string

  @State orderMap: OrderMap
  @State stock: Product[]
  @user.Getter loggedIn: boolean
  @user.State isActiveVip: boolean
  @order.State _id: string | null
  @order.Mutation setOrder: (order: Order) => void
  @order.Action getTracking: (id: string) => Promise<void>
  @cart.Action beginReorder: (orderId: string) => Promise<void>

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  mounted () {
    console.log('mounted', JSON.stringify(this.orderMap), this.$route.params.id, this.orderMap[this.$route.params.id])
    const order = this.orderMap[this.$route.params.id]
    if (order) {
      console.log('mounted and order present >>', order)
      debugger
      this.setOrder(order)
      this.getTracking(this.order.id)
    }
  }

  @Watch('orderMap')
  displayOrder () {
    console.log('orderMap changed', this.orderMap, this.$route.params.id)
    const order = this.orderMap[this.$route.params.id]
    if (order) {
      console.log('displayOrder', order)
      debugger
      this.setOrder(order)
      console.log('this._id', this._id, 'this.loggedIn', this.loggedIn)
    }
  }

  formattedDate (d: Date) {
    return `${this.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  get order () {
    console.log('this.orderMap', this.orderMap)
    return this.orderMap[this.$route.params.id]
  }

  get groupedItems () {
    return this.order.bundles[0].skus.reduce((carry: any, item: Item) => {
      const index = carry.findIndex((i: Item) => i.sku === item.sku)
      const product = this.stock.find((p: Product) => p.sku === item.sku)
      if (index === -1) {
        carry.push({ ...product, quantity: item.quantity, cost: item.cost })
      } else {
        carry[index].quantity += item.quantity
        carry[index].cost += item.cost
      }
      return carry
    }, [])
  }

  navToOrderHistory () {
    this.$router.push({ name: 'orderHistory' })
  }

  get cta () {
    const nonVipCopy = 'Reorder everything in this order as a one-time order. It is not a recurring order and you can modify the contents on the checkout page.'
    const copy = 'Reorder everything in this order as a one-time order with VIP pricing + free US shipping. It is not a recurring order and it doesn\'t modify your current subscription schedule. You can modify the contents on the checkout page.'
    return this.isActiveVip ? copy : nonVipCopy
  }

  reorder () {
    console.log('OrderDetail.reorder', this._id, 'this.loggedIn', this.loggedIn)
    if (this._id) this.beginReorder(this._id)
  }
}

</script>

<style scoped>
section {
  padding: 1rem;
}

section:not(:last-of-type) {
  border-bottom: 24px solid rgba(0, 0, 0, .1);
}

section.grouped-items {
  padding: 0;
}

.grouped-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, .4)
}

.reorder-button {
  background: transparent;
  font-weight: bold;
  border: none;
  outline: none;
  padding: 0;
  cursor: pointer;
  font-size: 1rem;
  color: rgb(109, 128, 180);
  border-bottom: 1px solid rgb(109, 128, 180);;
  transition: all .4s;
  margin-left: 1rem;
}

.reorder-button:hover {
  color: rgb(30, 48, 110);
  border-bottom-color: rgb(30, 48, 110);
}

.info-row {
  display: flex;
}

.info-row p:first-child {
  width: 10rem;
  font-weight: bold;
}

.info-row *:last-child {
  flex-grow: 1;
}

.order-history-nav {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  float: right;
}

.order-history-nav:hover {
  text-decoration: underline;
}

.proceed-to-checkout {
  padding: 1rem;
}
</style>
