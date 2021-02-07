<template>
  <div id="vip-detail">
    <Heading>Vip Detail</Heading>
    <Card class="item-modifier">
      <CardContent>
        <p>${{ vip.vipPrice / 100 }}</p>
        <div class="panel">
          <div class="delivery-settings">
            <h4>Modify Your VIP Settings</h4>
            <p>Next Delivery Date</p>
            <input type="date" :value="formattedDate" @change="updateNextDelivery" />
            <p>Delivery Frequency</p>
            <input type="range" :value="vip.cycleDays" @change="updateFrequency" step="5" />
            <p>Every {{ vip.cycleDays }} days</p>
          </div>
          <ItemListItem v-for="item of groupedItems" :key="item.sku" v-bind="item" @increment="incrementItem" />
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
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State, Getter, Action, Mutation } from 'vuex-class'
import Button from '../components/BaseButton.vue'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Chooser from '../components/Chooser.vue'
import ItemListItem from '../components/ItemListItem.vue'
import Heading from '../components/BaseHeading.vue'

@Component({ components: { Button, Card, CardContent, Chooser, ItemListItem, Heading } })
export default class VipDetail extends Vue {
  @State vipMap: VipMap
  @State stock: Product[]
  @Mutation setNextDelivery: any
  @Mutation setCycleDays: any
  @Mutation addItem: any
  @Mutation removeItem: any
  @Mutation setStatus: any
  @Action updateVip: (id: string) => Promise<void>
  @Action fetchPricing: (bundle: PricingBundle) => Promise<Pricing>

  confirmingPause = false
  pricing: Pricing | null = null

  get vip () {
    return this.vipMap[this.$route.params.id]
  }

  get groupedItems () {
    return this.vip.items.reduce((carry: any, item: Item) => {
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
    const d = this.vip.nextDelivery
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

  updateNextDelivery (e: Event) {
    const target = e.target as HTMLInputElement
    const nextDelivery = new Date(target.value)
    const offset = nextDelivery.getTimezoneOffset() // minutes
    nextDelivery.setMinutes(offset)
    this.vip.nextDelivery = nextDelivery
    this.setNextDelivery({ nextDelivery, id: this.vip._id })
    this.updateVip(this.vip._id)
  }

  updateFrequency (e: Event) {
    const target = e.target as HTMLInputElement
    const frequency = +target.value
    this.vip.cycleDays = frequency
    this.setCycleDays({ cycleDays: frequency, id: this.vip._id })
    this.updateVip(this.vip._id)
  }

  incrementItem ({ amount, sku }: { amount: number, sku: string }) {
    const skuCount = this.vip.items.filter((item: Item) => item.sku === sku).length
    if (amount < skuCount) {
      this.removeItem({ sku, id: this.vip._id })
      console.log('sku', sku)
    } else {
      console.log('amount', amount, 'sku', sku)
      const product = this.stock.find((product: Product) => product.sku === sku)
      if (!product) {
        console.error('failed to find sku', sku)
        throw new Error(`failed to find sku ${sku}`)
      }
      const item = { quantity: 1, sku, clothingType: product.clothingType }
      console.log('adding item', item, this.vip)
      this.addItem({ item, id: this.vip._id })
      console.log('item', item)
    }

    this.updateVip(this.vip._id)
  }

  chosenProduct (product: Product) {
    this.addItem({
      id: this.vip._id,
      item: { quantity: 1, sku: product.sku, clothingType: product.clothingType }
    })
  }

  pauseVIP () {
    this.setStatus({ id: this.vip._id, status: 'paused' })
  }

  stopVip () {
    this.setStatus({ id: this.vip._id, status: 'stopped' })
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

.item-modifier {
  max-width: 60rem;
}

.delivery-settings {
  width: 15rem;
}
</style>
