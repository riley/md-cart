<template>
  <div>
    <Heading>OrderHistory</Heading>
    <Card>
      <CardContent>
        <OrderThumb class="order" v-for="order in allOrders" :key="order.id" v-bind="order" :stock="stock" />
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'
import Heading from './BaseHeading.vue'
import OrderThumb from './OrderThumb.vue'

@Component({ components: { Card, CardContent, Heading, OrderThumb } })
export default class OrderHistory extends Vue {
  @Getter allOrders: Order[]
  @State stock: Product[]
}
</script>

<style scoped>
.order:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
}
</style>
