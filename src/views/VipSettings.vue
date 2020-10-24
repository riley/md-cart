<template>
  <div v-if="loggedIn">
    <Heading>Vip Settings</Heading>
    <div>
      <div class="vip-list" v-if="allVips.length > 1">
        <VipThumb v-for="vip of allVips" :key="vip._id" v-bind="vip" :stock="stock" @click.native="setActiveVip(vip)"/>
      </div>
    </div>
    <Overlay :active="!!activeVip" @dismiss="setActiveVip(null)">
      <Card class="item-modifier">
        <CardContent>
          <div class="panel">
            <div v-if="activeVip">
              <p>${{ activeVip.vipPrice / 100 }}</p>
              <div class="delivery-settings">
                <h4>Modify Your VIP Settings</h4>
                <p>Next Delivery Date</p>
                <input type="date" :value="formattedDate" @change="updateNextDelivery" />
                <p>Delivery Frequency</p>
                <input type="range" :value="activeVip.cycleDays" @change="updateFrequency" step="5" />
                <p>Every {{ activeVip.cycleDays }} days</p>
              </div>
              <ItemListItem v-for="item of groupedItems" :key="item.sku" v-bind="item" @increment="incrementItem" />
            </div>
            <Chooser :pricing="pricing" :stock="stock" @chosenProduct="chosenProduct" />
          </div>
          <div class="panel">
            <Button
              inline
              variant="primary"
              @click="pauseVIP">Pause VIP</Button>
            <Button
              inline
              variant="danger"
              @click="stopVip">Stop VIP</Button>
          </div>
        </CardContent>
      </Card>
    </Overlay>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Button from '../components/BaseButton.vue'
import ItemListItem from '../components/ItemListItem.vue'
import Chooser from '../components/Chooser.vue'
import VipThumb from '../components/admin/VipThumb.vue'
import Overlay from '../components/Overlay.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'

const user = namespace('user')

@Component({ components: { Button, Card, CardContent, Heading, ItemListItem, Chooser, VipThumb, Overlay } })
export default class VipSettings extends Vue {
  @State stock: Product[]
  @Getter allVips: VIP[]
  @user.Getter loggedIn: boolean
  @Mutation setNextDelivery: any
  @Mutation setCycleDays: any
  @Mutation addItem: any
  @Mutation removeItem: any
  @Mutation setStatus: any
  @Action updateVip: (id: string) => Promise<void>
  @Action fetchPricing: (bundle: PricingBundle) => Promise<Pricing>

  confirmingPause = false
  activeVip: VIP | null = null
  pricing: Pricing | null = null

  mounted () {
    this.activeVip = this.allVips[0]
  }

  get groupedItems () {
    if (!this.activeVip) return {}

    return this.activeVip.items.reduce((carry: any, item: Item) => {
      const index = carry.findIndex((p: {sku: string}) => p.sku === item.sku)
      if (index !== -1) {
        carry[index].quantity += 1
      } else {
        const product = this.stock.find((product: Product) => product.sku === item.sku)
        carry.push({ ...product, quantity: 1 })
      }
      return carry
    }, []).sort((a: {sku: string}, b: {sku: string}) => {
      if (a.sku < b.sku) return -1
      if (a.sku > b.sku) return 1
      return 0
    })
  }

  get formattedDate () {
    if (!this.activeVip) return ''

    const d = this.activeVip.nextDelivery
    return `${d.getFullYear()}-${(d.getMonth() + 1 + '').padStart(2, '0')}-${(d.getDate() + '').padStart(2, '0')}`
  }

  get supportsDatePicker () {
    const testElement = document.createElement('text') as HTMLInputElement
    try {
      testElement.type = 'date'
    } catch {
      return false
    }

    return testElement.type === 'date'
  }

  async setActiveVip (vip: VIP) {
    this.activeVip = vip

    if (this.activeVip) {
      const bundle = { isVip: true, skus: this.activeVip.items, pricingTier: this.activeVip.pricingTier }
      this.pricing = await this.fetchPricing(bundle)
      console.log('setActiveVip', vip, this.pricing)
    }
  }

  updateNextDelivery (e: Event) {
    if (!this.activeVip) return

    const target = e.target as HTMLInputElement
    const nextDelivery = new Date(target.value)
    const offset = nextDelivery.getTimezoneOffset() // minutes
    nextDelivery.setMinutes(offset)
    this.activeVip.nextDelivery = nextDelivery
    this.setNextDelivery({ nextDelivery, id: this.activeVip._id })
    this.updateVip(this.activeVip._id)
  }

  updateFrequency (e: Event) {
    if (!this.activeVip) return

    const target = e.target as HTMLInputElement
    const frequency = +target.value
    this.activeVip.cycleDays = frequency
    this.setCycleDays({ cycleDays: frequency, id: this.activeVip._id })
    this.updateVip(this.activeVip._id)
  }

  incrementItem ({ amount, sku }: { amount: number, sku: string }) {
    if (!this.activeVip) return

    const skuCount = this.activeVip.items.filter((item: Item) => item.sku === sku).length
    if (amount < skuCount) {
      this.removeItem({ sku, id: this.activeVip._id })
      console.log('sku', sku)
    } else {
      console.log('amount', amount, 'sku', sku)
      const product = this.stock.find((product: Product) => product.sku === sku)
      if (!product) {
        console.error('failed to find sku', sku)
        throw new Error(`failed to find sku ${sku}`)
      }
      const item = { quantity: 1, sku, clothingType: product.clothingType }
      console.log('adding item', item, this.activeVip)
      this.addItem({ item, id: this.activeVip._id })
      console.log('item', item)
    }

    this.updateVip(this.activeVip._id)
  }

  chosenProduct (product: Product) {
    if (!this.activeVip) return

    this.addItem({
      id: this.activeVip._id,
      item: { quantity: 1, sku: product.sku, clothingType: product.clothingType }
    })
  }

  pauseVIP () {
    if (!this.activeVip) return

    this.setStatus({ id: this.activeVip._id, status: 'paused' })
  }

  stopVip () {
    if (!this.activeVip) return

    this.setStatus({ id: this.activeVip._id, status: 'stopped' })
  }
}
</script>

<style scoped>
.panel {
  display: flex;
}

.panel:last-child {
  justify-content: flex-end;
}

.panel:last-child button {
  margin-left: 1rem;
}

.panel > div:first-child {
  margin-right: 1rem;
  max-width: 20rem;
  flex-shrink: 1;
}

.vip-list {
  margin-right: 1rem;
}

.item-modifier {
  max-width: 60rem;
}

.delivery-settings {
  width: 15rem;
}
</style>
