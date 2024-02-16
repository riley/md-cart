<template>
  <div id="past-orders" v-if="loggedIn">
    <Heading>Order History</Heading>
    <Card>
      <CardContent>
        <OrderThumb
          class="order"
          v-for="order in allOrders"
          :key="order.id"
          v-bind="order"
          @reorder="reorder"
          :stock="stock" />
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters, mapState, mapActions } from 'vuex'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Heading from '../components/BaseHeading.vue'
import OrderThumb from '../components/admin/OrderThumb.vue'

export default Vue.extend({
  name: 'OrderHistory',
  components: { Card, CardContent, Heading, OrderThumb },
  computed: {
    ...mapGetters(['allOrders']),
    ...mapGetters('user', ['loggedIn']),
    ...mapState(['stock']),
  },
  methods: {
    ...mapActions('cart', ['beginReorder']),
    reorder (orderId: string) {
      this.beginReorder(orderId)
    }
  }
})
</script>

<style scoped>
.order {
  padding-top: .5rem;
}

.order:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
  padding: .5rem 0;
}

.order:first-of-type {
  padding-top: 0;
}
</style>
