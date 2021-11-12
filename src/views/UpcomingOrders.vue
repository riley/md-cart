<template>
  <!-- this component displays upcoming VIP orders -->
  <div id="upcoming-orders" v-if="loggedIn">
    <Heading>Upcoming Order</Heading>
    <Card>
      <CardContent>
        <!-- <VipDetail v-for="vip of upcomingRebills" :key="vip._id" v-bind="vip" :stock="stock" /> -->
        <div v-for="vip of upcomingRebills" :key="vip._id">{{ vip._id }}</div>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import VipDetail from '../components/admin/VipDetail.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'

const user = namespace('user')

@Component({ components: { Card, CardContent, Heading, VipDetail } })
export default class UpcomingOrders extends Vue {
  @State vipMap: VipMap
  @State stock: Product[]
  @user.Getter loggedIn: boolean

  get upcomingRebills () {
    return Object.values(this.vipMap)
      .filter((vip: any) => vip.status === 'active')
  }
}
</script>
