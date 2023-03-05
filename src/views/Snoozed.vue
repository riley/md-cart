<template>
  <div>
    <Alert v-if="snoozeError" variant="warning" closeButton>
      <p v-html="snoozeError" />
    </Alert>
    <Card v-if="snoozedVIP">
      <CardContent>
        <Heading>Snooze Confirmation ✔</Heading>
        <p>You have successfully snoozed your VIP for {{ snoozedVIP.cycleDays }} days until {{ snoozedVIP.nextDelivery.toDateString() }}.</p>
        <ItemRow v-for="item of groupProducts(snoozedVIP.items)" :key="item.sku" :item="item" class="grouped-item" />
        <p>Check out some of our other products if you're not familiar with them yet</p>
        <div class="other-categories">
          <Upsell
            class="upsell"
            v-for="upsell of otherCategories"
            :key="upsell.clothingType"
            :price="getCost(upsell)"
            :retailPrice="getItemRetailCost(upsell)"
            :upsell="upsell"
            cta="Shop"
            @select="redirectToStore(upsell)"
          />
        </div>
      </CardContent>
    </Card>
    <div v-if="fetchingSnooze">
      <Spinner />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator'
import { State, Mutation, Action, namespace } from 'vuex-class'
import Alert from '@/components/BaseAlert.vue'
import Button from '@/components/BaseButton.vue'
import Heading from '@/components/BaseHeading.vue'
import Card from '@/components/BaseCard.vue'
import CardContent from '@/components/BaseCardContent.vue'
import ItemRow from '@/components/admin/ItemRow.vue'
import Pricing from '../utils/Pricing'
import Spinner from '@/components/BaseSpinner.vue'
import Upsell from '@/components/Upsell.vue'

const vip = namespace('vip')

@Component({ components: { Alert, Button, Card, CardContent, Heading, ItemRow, Spinner, Upsell } })
export default class Snoozed extends Vue {
  @State vipMap: VipMap
  @State stock: Product[]
  @State upsells: UpsellData[]
  @State snoozeError: string
  @State fetchingSnooze: boolean
  @State snoozedVIP: VIP
  @Mutation setSnoozedVIP: (vip: VIP) => void
  @vip.State items: Item[]

  pricing: Pricing = new Pricing(true)

  async mounted () {
    console.log('Snoozed mounted', this.$route.query)
    const url = new URL(window.location.href)
    console.log(url, url.searchParams, url.searchParams.get('id'))
    if (typeof this.$route.query.id === 'string') {
      const vip = this.vipMap[this.$route.query.id]
      console.log('Snoozed mounted', vip)
      if (vip) {
        this.setSnoozedVIP(vip)
      }
    } else {
      // show an error about a malformed url?
    }
  }

  @Watch('vipMap')
  displaySnoozedVip () {
    console.log('displaySnoozedVip', this.$route.query)
    if (typeof this.$route.query.id === 'string') {
      const vip = this.vipMap[this.$route.query.id]
      console.log('displaySnoozedVip', vip)
      if (vip) {
        this.setSnoozedVIP(vip)
      }
    }
  }

  get otherCategories () {
    if (!this.snoozedVIP) return

    console.log(this.snoozedVIP.nextDelivery, 'nextDelivery')
    const vipCategories = this.snoozedVIP.items.map((item: Item) => item.clothingType)
    const upsells = this.upsells
      .filter((upsell: UpsellData) => !vipCategories.includes(upsell.clothingType))
      .slice(0, 3)
    console.log('otherCategories', upsells)
    return upsells
  }

  groupProducts (items: Item[]) {
    return items.reduce((carry: any, item: Item) => {
      const index = carry.findIndex((p: {sku: string}) => p.sku === item.sku)
      if (index !== -1) {
        carry[index].quantity += 1
      } else {
        const product = this.stock.find((product: Product) => product.sku === item.sku)
        carry.push({ ...product, quantity: item.quantity, cost: item.cost })
      }
      return carry
    }, []).sort((a: {sku: string}, b: {sku: string}) => {
      if (a.sku < b.sku) return -1
      if (a.sku > b.sku) return 1
      return 0
    })
  }

  getCost (item: Item) {
    console.log('Snoozed.getCost', item)
    this.pricing.pricingTier = this.snoozedVIP.pricingTier
    return this.pricing.getNextPrice({ item, asVip: true }).nextItemPrice
  }

  getItemRetailCost (item: Item) {
    console.log('Snoozed.getItemRetailCost', item)
    return this.pricing.getBaseSingle({ clothingType: item.clothingType, sku: '' })
  }

  redirectToStore (item: UpsellData) {
    window.location.href = item.path
  }
}
</script>

<style scoped>
.other-categories {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  clear: both;
}

.grouped-item:not(:last-child) {
  border-bottom: 1px solid rgba(0, 0, 0, 0.4)
}
</style>
