<template>
  <div class="order" @click="showOrderDetail">
    <div class="thumbs">
      <Thumb
        v-for="(product, index) of Object.values(groupedProducts)"
        class="thumb"
        :style="{top: `${index * 5 + 10}px`, left: `${index * 5 + 10}px`}"
        :key="product.sku"
        :icon="product.icon" />
    </div>
    <p class="meta">
      <span class="medium">Order {{ id }} - {{ status }}</span><br>
      Placed {{ formattedDate(createdAt) }}<br>
      {{ bundles[0].skus.length }} items
      <Button @click="$emit('reorder', _id)" inline class="reorder">Order Again</Button>
      <Button href="https://mrdavis.com/returns" inline variant="plain">Initiate Return</Button>
    </p>
    <div class="detail">›</div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Thumb from '../BaseSkuThumb.vue'
import Button from '@/components/BaseButton.vue'

@Component({ components: { Button, Thumb } })
export default class OrderThumb extends Vue {
  @Prop() id: string
  @Prop() _id: string
  @Prop() status: string
  @Prop() bundles: Bundle[]
  @Prop() createdAt: Date
  @Prop() stock: Product[]

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  get groupedProducts () {
    return this.bundles[0].skus.reduce((carry: any, item: Item) => {
      const product = this.stock.find((product: Product) => product.sku === item.sku)
      if (carry[item.sku]) {
        carry[item.sku].quantity += 1
      } else {
        carry[item.sku] = { ...product, quantity: 1 }
      }
      return carry
    }, {})
  }

  formattedDate (d: Date) {
    return `${this.months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
  }

  showOrderDetail () {
    this.$router.push({ name: 'orderDetail', params: { id: this._id } })
  }
}
</script>

<style scoped>
.order {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  cursor: pointer;
}

.thumbs {
  min-width: 7rem;
  position: relative;
  flex-grow: 0;
}

.thumb {
  border: 1px solid #ccc;
  position: absolute;
  background-color: white;
}

.meta {
  flex-grow: 2;
  width: 20rem;
  padding-bottom: 0;
}

.medium {
  margin: 0 0 1rem;
  font-weight: bold;
}

.reorder {

}

.detail {
  font-size: 3em;
  color: #aaa;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 1rem;
}
</style>
