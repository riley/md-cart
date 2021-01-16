<template>
  <div id="vip-settings" v-if="loggedIn">
    <Heading>Vip Settings</Heading>
    <div>
      <div class="vip-list" v-if="allVips.length > 1">
        <VipThumb v-for="vip of allVips" :key="vip._id" v-bind="vip" :stock="stock"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import VipThumb from '../components/admin/VipThumb.vue'

const user = namespace('user')

@Component({ components: { Heading, VipThumb } })
export default class VipSettings extends Vue {
  @State stock: Product[]
  @Getter allVips: VIP[]
  @user.Getter loggedIn: boolean
}
</script>

<style scoped>
.vip-list {
  margin-right: 1rem;
}
</style>
