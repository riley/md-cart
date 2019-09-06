<template>
  <li class="cartItem_root">
    <div class="thumbnail" :style="{'background-color': color, 'background-image': `url(${imageURLs[0]})`}" />
    <div class="product-info">
      <p class="title">{{ title }}</p>
      <div class="bottom-row">
        <span class="cost">${{ cost / 100 }}</span>
        <BaseIncrementer @input="incrementItemQuantity" :value="quantity" />
      </div>
    </div>
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Mutation } from 'vuex-class'
import BaseIncrementer from './BaseIncrementer.vue'

@Component({
  components: { BaseIncrementer },
})
export default class CartItem extends Vue {
  @Prop() sku!: string
  @Prop() quantity!: number
  @Prop() title!: string
  @Prop() imageURLs!: string[]
  @Prop() clothingType!: string
  @Prop() cost!: number
  @Prop() color!: string

  @Mutation addItem: any
  @Mutation removeItem: any
  @Action updateCart: Promise<void>

  incrementItemQuantity (amount: number) {
    if (amount === 0) {
      this.removeItem(this.sku)
    } else {
      this.addItem({ sku: this.sku, quantity: 1, clothingType: this.clothingType })
    }
    console.log('incrementItemQuantity', amount, this.sku)
    // this.setItemQuantity()
  }
}
</script>

<style scoped>
.cartItem_root {
  list-style: none;
  display: flex;
  border-bottom: 1px solid #ccc;
  background-color: white;
  font-weight: 300;
  padding: 1rem 1rem 1rem 0;
}

.thumbnail {
  width: 4rem;
  height: 4rem;
  background-size: cover;
  border-radius: 2rem;
  margin-right: .5rem;
}

.product-info {
  flex-grow: 1;
}

.title {
  font-size: 17px;
  margin: 0;
  text-align: left;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
}

.cost {
  font-size: 2rem;
  color: grey;
}
</style>
