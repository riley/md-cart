<template>
  <div class="order-root">
    <OrderDetails />
    <OrderItemSummary />
  </div>
</template>

<script lang="ts">
import OrderDetails from './components/OrderDetails.vue'
import OrderItemSummary from './components/OrderItemSummary.vue'

export default {
  components: { OrderDetails, OrderItemSummary }
}
</script>

<style scoped>
.order-root {
  width: 100%;
  max-width: 70rem;
  margin: 0 auto;
}

@media (min-width: 767px) {
  .order-root {
    display: flex;
    justify-content: space-between;
  }

  .order-root > div {
    width: calc(50% - .5rem);
  }
}
</style>
