<template>
  <div class="vip" @click="showVipDetail">
    <div class="thumbs">
      <Thumb
        v-for="(product, index) of Object.values(groupedProducts)"
        class="thumb"
        :style="{top: `${index * 5 + 10}px`, left: `${index * 5 + 10}px`}"
        :key="product.sku"
        :icon="product.icon" />
    </div>
    <div :data-id="_id">
      Next Order: {{ months[nextDelivery.getMonth()] }}. {{ nextDelivery.getDate() }} {{ nextDelivery.getFullYear() }}<br>
      {{ items.length }} items
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Thumb from '../BaseSkuThumb.vue'

@Component({ components: { Thumb } })
export default class VipThumb extends Vue {
  @Prop() items: Item[]
  @Prop() _id: string
  @Prop() nextDelivery: Date
  @Prop() stock: Product[]

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  get groupedProducts () {
    return this.items.reduce((carry: any, item: Item) => {
      if (carry[item.sku]) {
        carry[item.sku].quantity += 1
      } else {
        const product = this.stock.find((product: Product) => product.sku === item.sku)
        carry[item.sku] = { ...product, quantity: 1 }
      }
      return carry
    }, {})
  }

  showVipDetail () {
    this.$router.push({ name: 'vipDetail', params: { id: this._id } })
  }
}
</script>

<style scoped>
.vip {
  display: flex;
  min-height: 6rem;
  padding: 1rem;
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
</style>
