<template>
  <div class="vip" @click="showVipDetail">
    <div class="thumbs">
      <Thumb
        v-for="(product, index) of Object.values(groupedProducts)"
        class="thumb"
        :style="{top: `${index * 5}px`, left: `${index * 5}px`}"
        :key="product.sku"
        :icon="product.icon" />
    </div>
    <span class="checkmark-icon">
      <svg aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline class="step-completed-checkmark" points="2.5,9.5 7.5,14.5 17.5,4.5"></polyline></svg>
    </span>
    <div :data-id="_id" class="delivery-info">
      <span class="next-order-date">Next Order</span>
      <br>
      {{ months[nextDelivery.getMonth()] }} {{ nextDelivery.getDate() }}, {{ nextDelivery.getFullYear() }} - {{ items.length }} items
    </div>
    <button class="edit">Edit</button>
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

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

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
  cursor: pointer;
  align-items: flex-start;
}

.delivery-info {
  flex-grow: 1;
}

.checkmark-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgb(46, 132, 89);
  border-radius: 50%;
  width: 1.875rem;
  height: 1.875rem;
  margin-right: 1rem;
}

.checkmark-icon svg {
  width: 0.9375rem;
  height: 0.9375rem;
  margin-top: 1px;
  stroke: rgb(46, 132, 89);
  fill: transparent;
}

.next-order-date {
  font-weight: bold;
  color: #5b7975;
  margin-bottom: .5rem;
  display: inline-block;
}

.edit {
  border: 0;
  background: transparent;
  border-bottom: 0.0625rem solid rgba(33, 43, 100, 0.25);
  text-decoration: none;
  display: inline-block;
  transition: all .2s ease 0s;
  cursor: pointer;
}

.edit:hover {
  border-bottom-color: rgb(30, 48, 110);
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
