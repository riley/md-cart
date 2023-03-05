<template>
  <div id="send-now" v-if="loggedIn">
    <Heading>Place an Order</Heading>
    <p>{{ prompt }}</p>
    <div class="upsells">
      <Upsell
        v-for="upsell in upsells"
        :key="upsell.clothingType"
        :price="getCost(upsell)"
        :retailPrice="getItemRetailCost(upsell)"
        :upsell="upsell"
        cta="Shop"
        @select="redirectToStore(upsell)" />
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
  @user.State pricingTier: number
  @user.State isActiveVip: boolean
  @State upsells: any[]

  pricing: Pricing

  constructor () {
    super()
    this.pricing = new Pricing(this.isActiveVip, this.pricingTier)
  }

  getCost (item: Item) {
    this.pricing.pricingTier = this.pricingTier
    return this.pricing.getNextPrice({ item, asVip: this.isActiveVip }).nextItemPrice
  }

  getItemRetailCost (item: Item) {
    return this.pricing.getBaseSingle({ clothingType: item.clothingType, sku: item.sku })
  }

  redirectToStore (item: any) {
    location.href = item.path
  }

  get prompt () {
    const copy = 'As a VIP, you can make single orders whenever you like and still get VIP pricing plus free US shipping. To place a one-time, non recurring order, just navigate our site and purchase as normal, and we’ll automatically apply your discount without creating another recurring order. Note that this does NOT replace your current VIP subscription. It is just a single order with a discount based on your VIP status and whatever quantity of products you purchase.'

    // this might change in the future if we ever show this screen to non-vip users
    return copy
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
