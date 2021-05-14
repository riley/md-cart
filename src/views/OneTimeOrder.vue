<template>
  <div id="send-now" v-if="loggedIn">
    <Heading>Place an Order</Heading>
    <div class="upsells">
      <Upsell v-for="upsell in upsells" :key="upsell.clothingType" :upsell="upsell" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Upsell from '../components/Upsell.vue'

const user = namespace('user')

@Component({ components: { Heading, Upsell } })
export default class OneTimeOrder extends Vue {
  @user.Getter loggedIn: boolean
  @State upsells: any[]
}
</script>

<style scoped>
.upsells {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}
</style>
