<template>
  <ItemSkeleton v-if="fetching" />
  <li v-else class="cartItem_root" :class="{ inverse }">
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
import ItemSkeleton from './cart/CartItemSkeleton.vue'

const cart = namespace('cart')

@Component({
  components: { Incrementer, ItemSkeleton, Badge, Thumb },
})
export default class ItemListItem extends Vue {
  @Prop() sku!: string
  @Prop() quantity!: number
  @Prop() title!: string
  @Prop() icon!: string
  @Prop() clothingType!: string
  @Prop() cost!: number
  @Prop() color!: string
  @Prop({ type: Boolean, default: false }) inverse: boolean

  @Prop() fetching: boolean

  async incrementItemQuantity (amount: number) {
    this.$emit('increment', { amount, sku: this.sku })
  }
}
</script>

<style scoped>
.cartItem_root {
  list-style: none;
  display: flex;
  border-bottom: 1px solid #ccc;
  font-weight: 300;
  padding: 1rem 0;
}

.cartItem_root > div {
  box-sizing: border-box;
}

.incrementer.fetching {
  opacity: .3;
  pointer-events: none;
}

.product-info {
  flex-grow: 1;
  margin: 0 1rem;
}

.title {
  font-size: 1rem;
  margin: 0;
  text-align: left;
}

.cost {
  font-size: 2rem;
  color: grey;
}
</style>
