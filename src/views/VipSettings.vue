<template>
  <div id="vip-settings" v-if="loggedIn">
    <Heading>VIP Settings</Heading>
    <p>Below you will find a list of your VIP subscriptions. By clicking “Edit” you can change your frequency, stop your VIP subscription, or modify the contents of future orders.</p>
    <Card>
      <CardContent class="vip-list" v-if="allVips.length > 0">
        <VipThumb
          class="vip"
          v-for="vip of allVips"
          :key="vip._id"
          v-bind="vip"
          @vipSelected="showVipDetail"
          :stock="stock"/>
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import VipThumb from '../components/admin/VipThumb.vue'

const user = namespace('user')

@Component({ components: { Heading, Card, CardContent, VipThumb } })
export default class VipSettings extends Vue {
  @State stock: Product[]
  @State vipMap: VipMap
  @Getter allVips: VIP[]
  @user.Getter loggedIn: boolean

  showVipDetail (_id: string) {
    this.$router.push({ name: 'vipDetail', params: { id: _id } })
  }
}
</script>

<style scoped>
.vip-list {
  margin-right: 1rem;
}

.vip:not(:last-of-type) {
  border-bottom: 1px solid #ccc;
  margin-bottom: 1rem;
}
</style>
