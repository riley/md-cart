<template>
  <!-- this component displays upcoming VIP orders -->
  <div>
    <Heading>UpcomingOrders</Heading>
    <Card>
      <CardContent>
        <VipDetail v-for="vip of upcomingRebills" :key="vip._id" v-bind="vip" :stock="stock" />
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter } from 'vuex-class'
import Heading from './BaseHeading.vue'
import VipDetail from './VipDetail.vue'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'

@Component({ components: { Card, CardContent, Heading, VipDetail } })
export default class UpcomingOrders extends Vue {
  @Getter upcomingRebills: VIP[]
  @State stock: Product[]
}
</script>
