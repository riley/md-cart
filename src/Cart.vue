<template>
  <div>
    <CartSummary />
    <CustomerInfoInputs />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, State, Getter, namespace } from 'vuex-class'
import CartSummary from './components/CartSummary.vue'
import CustomerInfoInputs from './components/CustomerInfoInputs.vue'

const cart = namespace('cart')

@Component({
  components: {
    CartSummary,
    CustomerInfoInputs,
  },
})
export default class Cart extends Vue {
  @cart.State stock: Product[]
  @cart.Action fetchStock: () => Promise<void>
  @cart.Action fetchCart: () => Promise<void>

  async mounted () {
    await this.fetchStock()
    this.fetchCart()
  }
}
</script>

<style>
.log-thing {
  display: flex;
  min-width: 400px;
  background: darkslateblue;
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
}

.log-thing > div {
  flex: 1;
}
</style>
