<template>
  <div v-if="loggedIn">
    <Heading>OrderHistory</Heading>
    <Card>
      <CardContent>
        <OrderThumb
          class="order"
          v-for="order in allOrders"
          :key="order.id"
          v-bind="order"
          :stock="stock"
          @click.native="setActiveOrder(order)" />
      </CardContent>
    </Card>
    <Overlay :active="!!activeOrder" @dismiss="setActiveOrder(null)">
      <Card v-if="activeOrder">
        <CardContent>
          <section>
            <div class="info-row">
              <p>status</p>
              <p>{{ activeOrder.status }}</p>
            </div>
          </section>
          <section>
            <div class="info-row">
              <p>Order id</p>
              <p>{{ activeOrder.id }}</p>
            </div>
            <div class="info-row">
              <p>Order placed</p>
              <p>{{ formattedDate(activeOrder.createdAt) }}</p>
            </div>
            <div class="info-row">
              <p>Order total</p>
              <p>${{ activeOrder.totalPrice / 100 }}</p>
            </div>
            <div class="info-row">
              <p>ship to</p>
              <Address displayOnly v-bind="activeOrder.shippingAddress" />
            </div>
            <div class="info-row">
              <p>bill to</p>
              <Address displayOnly v-bind="activeOrder.billingAddress" />
            </div>
          </section>
          <section>
            <div v-for="item of groupedItems" :key="item.sku">
              <img src="iconUrl(item.icon)" />
              <p>{{ item.title }} ${{ isNaN(item.cost / 100) ? '0' : item.cost / 100 }} {{ item.quantity }}x</p>
            </div>
            <div class="info-row">
              <p>Subtotal</p>
              <p>${{ activeOrder.subtotal / 100 }}</p>
            </div>
            <div class="info-row">
              <p>Mr. Davis Credits</p>
              <p>-${{ activeOrder.totalDiscount }}</p>
            </div>
            <div class="info-row">
              <p>Shipping</p>
              <p>${{ activeOrder.shipping.postage / 100 }}</p>
            </div>
            <div class="info-row">
              <p>Sales Tax</p>
              <p>${{ activeOrder.totalTax / 100 }}</p>
            </div>
            <div class="info-row">
              <p>Order Total (USD)</p>
              <p>${{ activeOrder.totalPrice / 100 }}</p>
            </div>
          </section>
        </CardContent>
      </Card>
    </Overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Address from '../components/BaseAddress.vue'
import Heading from '../components/BaseHeading.vue'
import OrderThumb from '../components/admin/OrderThumb.vue'
import Overlay from '../components/Overlay.vue'

const user = namespace('user')

@Component({ components: { Card, CardContent, Heading, OrderThumb, Overlay, Address } })
export default class OrderHistory extends Vue {
  @Getter allOrders: Order[]
  @user.Getter loggedIn: boolean
  @State stock: Product[]

  activeOrder: Order | null = null
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  mounted () {
    this.activeOrder = this.allOrders[0]
  }

  setActiveOrder (order: Order) {
    this.activeOrder = order
    console.log('activeOrder', order)
  }

  get groupedItems () {
    if (!this.activeOrder) return

    return this.activeOrder.bundles[0].skus.reduce((carry: any, item: Item) => {
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

  formattedDate (d: Date) {
    return `${this.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  iconUrl (icon: string) {
    return `/img/icons/${icon}`
  }
}
</script>

<style scoped>
.order:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
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
</style>
