<template>
  <li class="cartItem_root">
    <Badge :count="quantity" class="thumb-container">
      <div class="thumbnail" :style="{'background-color': color, 'background-image': `url(${imageURLs[0]})`}" />
    </Badge>
    <div class="product-info">
      <p class="title">{{ title }}</p>
      <div class="bottom-row">
        <div v-if="fetching" class="spinner-container">
          <Spinner />
        </div>
        <span v-else class="cost">${{ cost / 100 }}</span>
      </div>
    </div>
    <Incrementer class="incrementer" @input="incrementItemQuantity" :value="quantity" />
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Mutation, namespace } from 'vuex-class'
import Incrementer from './BaseIncrementer.vue'
import Badge from './BaseBadge.vue'
import Spinner from './BaseSpinner.vue'

const cart = namespace('cart')

@Component({
  components: { Incrementer, Spinner, Badge },
})
export default class CartItem extends Vue {
  @Prop() sku!: string
  @Prop() quantity!: number
  @Prop() title!: string
  @Prop() imageURLs!: string[]
  @Prop() clothingType!: string
  @Prop() cost!: number
  @Prop() color!: string

  @cart.Mutation addItem: any
  @cart.Mutation removeItem: any
  @cart.Action updateCart: () => Promise<void>

  fetching = false

  async incrementItemQuantity (amount: number) {
    if (this.fetching) return

    if (amount < this.quantity) {
      this.removeItem(this.sku)
    } else {
      this.addItem({ sku: this.sku, quantity: 1, clothingType: this.clothingType })
    }
    this.fetching = true
    console.log('incrementItemQuantity', amount, this.sku)
    await this.updateCart()
    this.fetching = false
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
}

.thumb-container {
  margin-right: 1rem;
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

.spinner-container {
  display: inline-block;
}
</style>
