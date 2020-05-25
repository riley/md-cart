<template>
  <ItemSkeleton v-if="fetching" />
  <li v-else class="cartItem_root">
    <Thumb :icon="icon" />
    <div class="product-info">
      <p class="title">{{ title }}</p>
    </div>
    <Incrementer class="incrementer" :class="{ fetching: fetching }" @input="incrementItemQuantity" :value="quantity" />
  </li>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, Mutation, namespace } from 'vuex-class'
import Incrementer from './BaseIncrementer.vue'
import Badge from './BaseBadge.vue'
import Thumb from './BaseSkuThumb.vue'
import ItemSkeleton from './CartItemSkeleton.vue'

const cart = namespace('cart')

@Component({
  components: { Incrementer, Badge, Thumb },
})
export default class ItemListItem extends Vue {
  @Prop() sku!: string
  @Prop() quantity!: number
  @Prop() title!: string
  @Prop() icon!: string
  @Prop() clothingType!: string
  @Prop() cost!: number
  @Prop() color!: string

  // @cart.State host: string
  @Prop() fetching: boolean
  // @cart.Mutation addItem: any
  // @cart.Mutation removeItem: any
  // @cart.Action updateCart: () => Promise<void>

  async incrementItemQuantity (amount: number) {
    this.$emit('increment', { amount, sku: this.sku })

    // if (this.fetching) return

    // if (amount < this.quantity) {
    //   this.removeItem(this.sku)
    // } else {
    //   this.addItem({ sku: this.sku, quantity: 1, clothingType: this.clothingType })
    // }
    // await this.updateCart()
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
  padding: 1rem 0;
}

.incrementer.fetching {
  opacity: .3;
  pointer-events: none;
}

.product-info {
  flex-grow: 1;
}

.title {
  font-size: 17px;
  margin: 0;
  text-align: left;
}

.cost {
  font-size: 2rem;
  color: grey;
}
</style>
