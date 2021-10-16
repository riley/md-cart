<template>
  <div>
    <Heading>Order Detail</Heading>
    <Card>
      <section>
        <div class="info-row">
          <p>status</p>
          <p>{{ order.status }}</p>
        </div>
      </section>
      <section class="grouped-items">
        <div v-for="item of groupedItems" :key="item.sku" class="grouped-item">
          <img class="thumb" :src="iconUrl(item.icon)" />
          <div class="item-detail">
            <span class="item-title">{{ item.title }}</span>
            <span class="item-quantity">
              Qty {{ item.quantity }}
              <button
                class="reorder-button"
                @click="reorder">
                Reorder
              </button>
            </span>
          </div>
          <div class="item-cost">${{ isNaN(item.cost / 100) ? '0' : item.cost / 100 }}</div>
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
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import Card from '@/components/BaseCard.vue'
import Address from '@/components/BaseAddress.vue'
import Heading from '@/components/BaseHeading.vue'
import Button from '@/components/BaseButton.vue'
import { env } from '@/utils/computed'

const cart = namespace('cart')

@Component({ components: { Card, Button, Address, Heading } })
export default class OrderDetail extends Vue {
  @Prop() id: string
  @State orderMap: OrderMap
  @State stock: Product[]
  @cart.Action beginReorder: (items: Item[]) => Promise<void>

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  formattedDate (d: Date) {
    return `${this.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  iconUrl (icon: string) {
    return `https://${env === 'production' ? 'mrdavis.com' : 'staging.mrdavis.com'}/img/icons/${icon}`
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

  reorder (sku: string) {
    // this.beginReorder([{ sku, quantity: 1 }])
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

.grouped-item {
  padding: 1rem;
  display: flex;
  align-items: flex-start;
}

.grouped-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, .4)
}

.item-detail {
  flex: 1 0;
}

.item-quantity {
  display: block;
  margin-bottom: 1rem;
}

.item-title, .item-cost {
  display: block;
  margin-bottom: 1rem;
  font-weight: bold;
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

.thumb {
  max-width: 8rem;
  max-height: 8rem;
  margin-right: .5rem;
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
