<template>
  <!-- this component displays upcoming VIP orders -->
  <div v-if="loggedIn">
    <Heading>UpcomingOrders</Heading>
    <Card>
      <CardContent>
        Have this always be showing with active vips {{ upcomingRebills.length }}
        <VipDetail v-for="vip of upcomingRebills" :key="vip._id" v-bind="vip" :stock="stock" />
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
  @Getter upcomingRebills: VIP[]
  @State stock: Product[]
  @user.Getter loggedIn: boolean
}
</script>
