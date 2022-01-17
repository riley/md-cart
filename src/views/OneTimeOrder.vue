<template>
  <div id="send-now" v-if="loggedIn">
    <Heading>Place an Order</Heading>
    <div class="upsells">
      <Upsell
        v-for="upsell in upsells"
        :key="upsell.clothingType"
        :price="getCost(upsell.clothingType, upsell.sku)"
        :upsell="upsell" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Upsell from '../components/Upsell.vue'
import Pricing from '../utils/Pricing'

const user = namespace('user')

@Component({ components: { Heading, Upsell } })
export default class OneTimeOrder extends Vue {
  @user.Getter loggedIn: boolean
  @State upsells: any[]

  pricing: Pricing

  constructor () {
    super()
    this.pricing = new Pricing(false)
  }

  getCost (clothingType: string, sku: string) {
    return this.pricing.getBaseSingle({ clothingType, sku })
  }
}
</script>

<style scoped>
.upsells {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 1rem;
}

@media (max-width: 50rem) {
  .upsells {
    display: flex;
    flex-direction: column;
  }
}
</style>
