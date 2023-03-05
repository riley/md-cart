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
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Action, namespace } from 'vuex-class'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Heading from '../components/BaseHeading.vue'
import OrderThumb from '../components/admin/OrderThumb.vue'

const user = namespace('user')
const cart = namespace('cart')

@Component({ components: { Card, CardContent, Heading, OrderThumb } })
export default class OrderHistory extends Vue {
  @Getter allOrders: Order[]
  @user.Getter loggedIn: boolean
  @State stock: Product[]
  @cart.Action beginReorder: (orderId: string) => Promise<void>

  reorder (orderId: string) {
    this.beginReorder(orderId)
  }
}
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
