<template>
  <div class="vip-detail">
    <p>Order Date {{ orderDate }}</p>
    <ul>
      <li v-for="product of Object.values(groupedProducts)" :key="product.sku">
        <Badge :count="product.quantity">
          <Thumb :icon="product.icon" />
        </Badge>
      </li>
    </ul>
    <p>${{ vipPrice / 100 }}</p>
    <Button inline>Snooze</Button>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Thumb from '../BaseSkuThumb.vue'
import Badge from '../BaseBadge.vue'
import Button from '../BaseButton.vue'

@Component({ components: { Button, Thumb, Badge } })
export default class VipDetail extends Vue {
  @Prop() _id: string
  @Prop() items: Item[]
  @Prop() nextDelivery: Date
  @Prop() vipPrice: number
  @Prop() stock: Product[]

  getIcon (sku: string) {
    const product = this.stock.find((product: Product) => product.sku === sku)
    return product ? `https://mrdavis.com/img/icons/${product.icon}` : ''
  }

  get groupedProducts () {
    return this.items.reduce((carry: any, item: Item) => {
      const product = this.stock.find((product: Product) => product.sku === item.sku)

      if (carry[item.sku]) {
        carry[item.sku].quantity += 1
      } else {
        carry[item.sku] = { ...product, quantity: 1 }
      }
      return carry
    }, {})
  }

  get orderDate () {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    return `${months[this.nextDelivery.getMonth()]}. ${this.nextDelivery.getDate()} ${this.nextDelivery.getFullYear()}`
  }
}
</script>

<style scoped>
.vip-detail {
  display: flex;
  justify-content: space-between;
}

.vip-detail:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
}

.vip-detail ul li {
  display: inline;
}
</style>
