<template>
  <div id="action-chooser">
    <div class="choices">
      <ActionPanel v-if="upcomingRebills.length > 0" title="See Upcoming Order" path="/upcoming-orders" icon="parcel" />
      <ActionPanel title="Make a New Order" path="/send-now" icon="add" />
      <ActionPanel title="Change Account Settings" path="/account-settings" icon="account" />
      <ActionPanel title="See Past Orders" path="/past-orders" icon="list" />
      <ActionPanel v-if="vips.length > 0" title="Change Vip Settings" path="/vip-settings" icon="settings" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State } from 'vuex-class'
import ActionPanel from '../components/admin/ActionPanel.vue'

@Component({ components: { ActionPanel } })
export default class ActionChooser extends Vue {
  @State vipMap: VipMap
  @State vips: VIP[]

  get upcomingRebills () {
    return Object.values(this.vipMap)
      .filter((vip: any) => vip.status === 'active')
  }
}
</script>

<style scoped>
.choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  grid-gap: 1rem;
  margin-bottom: 1rem;
}
</style>
