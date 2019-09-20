<template>
  <div v-if="order != null" id="order-summary" class="order-summary">
    <div class="customer-summary">
      order number {{ order.id }}
      Thank you {{ order.billingAddress.name }}
      <ShipStatus />
      <Card>
        <h2>Order Updates</h2>
        <p>You'll get shipping and delivery updates via email</p>
      </Card>
      <Card>
        <CustomerInfo />
      </Card>
      <p>
        Need help? <a href="mailto:support@mrdavis.com">Contact us</a>
        <Button @click="continueShopping" position="right">Continue Shopping</Button>
      </p>
    </div>
    <ItemSummary class="item-summary" :bundle="order.bundles[0]" :stock="stock" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Action } from 'vuex-class'
import Button from './components/BaseButton.vue'
import Card from './components/BaseCard.vue'
import ItemSummary from './components/ItemSummary.vue'
import ShipStatus from './components/ShipStatus.vue'
import CustomerInfo from './components/CustomerInfo.vue'

@Component({
  components: { ItemSummary, CustomerInfo, ShipStatus, Card, Button }
})
export default class Thankyou extends Vue {
  @Action fetchStock: () => Promise<void>
  @Action fetchOrder: () => Promise<void>
  @State order: Order
  @State stock: Product[]

  async mounted () {
    await this.fetchStock()
    // order: 5d54cfcd4e391e01d879e441
    this.fetchOrder()
  }

  continueShopping () {
    location.href = 'https://mrdavis.com'
  }
}
</script>

<style scoped>
.order-summary {
  display: flex;
}

.item-summary {
  min-width: 10rem;
  background-color: #ddd;
}

@media (max-width: 800px) {
  .item-summary {
    order: -1;
  }
}
</style>
