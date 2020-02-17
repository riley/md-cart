<template>
  <div class="cart-root">
    <CartSummary />
    <CustomerInfoInputs />
  </div>
</template>

<script lang="ts">
import CartSummary from './components/CartSummary.vue'
import CustomerInfoInputs from './components/CustomerInfoInputs.vue'

// this class exists because we put it back into one div, but I didn't want to
// put all the code back together just yet
export default {
  components: { CartSummary, CustomerInfoInputs }
}
</script>

<style scoped>
.cart-root {
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;
}

@media (min-width: 850px) {
  .cart-root {
    display: flex;
    justify-content: space-between;
  }

  .cart-root > div {
    width: calc(50% - .5rem);
  }
}

</style>
