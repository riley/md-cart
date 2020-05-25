<template>
  <div class="order">
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
      Placed {{ createdAt.toLocaleString() }}<br>
      {{ bundles[0].skus.length }} items
    </p>
    <p class="detail" @click="showOrderDetail">›</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Thumb from './BaseSkuThumb.vue'

@Component({ components: { Thumb } })
export default class OrderThumb extends Vue {
  @Prop() id: string
  @Prop() status: string
  @Prop() bundles: Bundle[]
  @Prop() createdAt: Date
  @Prop() stock: Product[]

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

  showOrderDetail () {
    console.log('showOrderDetail')
  }
}
</script>

<style scoped>
.order {
  display: flex;
  justify-content: space-between;
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
  flex-grow: 1;
  width: 20rem;
}

.medium {
  margin: 0 0 1rem;
  font-weight: bold;
}

.detail {
  font-size: 3em;
  margin: 0;
  color: #aaa;
}
</style>
