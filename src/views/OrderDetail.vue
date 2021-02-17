<template>
  <div>
    <Heading>Order Detail</Heading>
    <Card>
      <CardContent>
        <section>
          <div class="info-row">
            <p>status</p>
            <p>{{ order.status }}</p>
          </div>
        </section>
        <section>
          <div class="info-row">
            <p>Order id</p>
            <p>{{ order.id }}</p>
          </div>
          <div class="info-row">
            <p>Order placed</p>
            <p>{{ formattedDate(order.createdAt) }}</p>
          </div>
          <div class="info-row">
            <p>Order total</p>
            <p>${{ order.totalPrice / 100 }}</p>
          </div>
          <div class="info-row">
            <p>ship to</p>
            <Address v-bind="order.shippingAddress" />
          </div>
          <div class="info-row">
            <p>bill to</p>
            <Address v-bind="order.billingAddress" />
          </div>
        </section>
        <section>
          <div v-for="item of groupedItems" :key="item.sku">
            <img src="iconUrl(item.icon)" />
            <p>{{ item.title }} ${{ isNaN(item.cost / 100) ? '0' : item.cost / 100 }} {{ item.quantity }}x</p>
          </div>
          <div class="info-row">
            <p>Subtotal</p>
            <p>${{ order.subtotal / 100 }}</p>
          </div>
          <div class="info-row">
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
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import CardContent from '../components/BaseCardContent.vue'
import Card from '../components/BaseCard.vue'
import Address from '../components/BaseAddress.vue'
import Heading from '../components/BaseHeading.vue'

@Component({ components: { Card, CardContent, Address, Heading } })
export default class OrderDetail extends Vue {
  @Prop() id: string
  @State orderMap: OrderMap
  @State stock: Product[]

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  formattedDate (d: Date) {
    return `${this.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  iconUrl (icon: string) {
    return `/img/icons/${icon}`
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
}

</script>

<style scoped>
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
