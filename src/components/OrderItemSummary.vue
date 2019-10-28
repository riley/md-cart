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
      <li v-if="discount > 0" class="discount">
        <span>Mr. Davis Rewards</span>
        <span>-${{ discount / 100 }}</span>
      </li>
      <li v-if="referDiscount" class="discount">
        <span>Refer Discount</span>
        <span>-$10</span>
      </li>
      <li v-if="tax > 0">
        <span>Tax</span>
        <span>${{ tax }}</span>
      </li>
      <li class="grandTotal">
        <span>Total</span>
        <span>${{ grandTotal / 100 }}</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import Item from './OrderItem.vue'

@Component({
  components: { Item }
})
export default class OrderItemSummary extends Vue {
  @Prop() referDiscount: number
  @Prop() stock: Product[]
  @Prop() bundle: Bundle
  @Prop() grandTotal: number
  @Prop() subtotal: number
  @Prop() postage: number
  @Prop() discount: number
  @Prop() tax: number

  get items () {
    return this.bundle.skus.reduce((carry: any[], item) => {
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
  }
}
</script>

<style scoped>
.order-item-summary {
  padding: 4rem;
  max-width: 30rem;
  background-color: rgba(0, 0, 0, .07);
}

.totals {
  padding: 0;
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
