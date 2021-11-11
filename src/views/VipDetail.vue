<template>
  <div id="vip-detail">
    <Heading>Vip Detail</Heading>
    <Card class="item-modifier">
      <div class="delivery-settings">
        <h4>Modify Your VIP Settings</h4>
        <div class="panel">
          <div>
            <p>Next Delivery Date</p>
            <input type="date" :value="formattedDate" @change="updateNextDelivery" />
          </div>
          <div>
            <p>Delivery Frequency</p>
            <input
              type="range"
              min="0"
              max="100"
              :value="vip.cycleDays"
              @change="updateFrequency"
              step="5" />
            <output style="display: inline-block">Every {{ vip.cycleDays }} days</output>
          </div>
        </div>
      </div>
      <div class="items">
        <h4>Customize Your Delivery</h4>
        <p><strong>VIP Total</strong> → ${{ vip.vipPrice / 100 }}</p>
        <div class="panel">
          <ul class="vip-items">
            <ItemListItem
              v-for="item of groupedItems"
              inverse
              :key="item.sku"
              v-bind="item"
              @increment="incrementItem" />
          </ul>
          <Chooser
            v-if="pickerOpen"
            class="chooser"
            vipPricing
            :upsells="upsells"
            :stock="stock"
            :clothingType="chooserClothingType"
            @chosenProduct="chosenProduct" />
          <div v-if="!pickerOpen" class="add-more-prompt">
            <h4 class="add-clothing">Add clothing to your VIP</h4>
            <div class="add-more-buttons">
              <Upsell
                class="upsell"
                v-for="upsell in upsells"
                :key="upsell.clothingType"
                :price="getCost(upsell)"
                :upsell="upsell"
                @select="openPicker(upsell.clothingType)" />
            </div>
          </div>
        </div>
      </div>
      <ButtonTray>
        <Button
          inline
          variant="primary"
          @click="pauseVIP">Pause VIP</Button>
        <Button
          inline
          variant="danger"
          @click="stopVip">Stop VIP</Button>
      </ButtonTray>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import { State, Getter, Action, Mutation } from 'vuex-class'
import Button from '@/components/BaseButton.vue'
import Card from '@/components/BaseCard.vue'
import CardContent from '@/components/BaseCardContent.vue'
import Chooser from '@/components/Chooser.vue'
import ItemListItem from '@/components/ItemListItem.vue'
import Heading from '@/components/BaseHeading.vue'
import ButtonTray from '@/components/ButtonTray.vue'
import Upsell from '@/components/Upsell.vue'
import Pricing from '../utils/Pricing'

@Component({ components: { Button, ButtonTray, Card, CardContent, Chooser, ItemListItem, Heading, Upsell } })
export default class VipDetail extends Vue {
  @State vipMap: VipMap
  @State stock: Product[]
  @State upsells: any[]
  @Mutation setNextDelivery: any
  @Mutation setCycleDays: any
  @Mutation addItem: any
  @Mutation removeItem: any
  @Mutation setStatus: any
  @Action updateVip: (id: string) => Promise<void>

  chooserClothingType: string = 'undershirts'
  confirmingPause = false

  pickerOpen = false
  pricing: Pricing

  constructor () {
    super()
    this.pricing = new Pricing(true)
  }

  get vip () {
    const vip = this.vipMap[this.$route.params.id]
    // probably not necessary
    this.pricing.selectedItems = vip.items
    this.pricing.pricingTier = vip.pricingTier
    return vip
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
    const { value } = e.target as HTMLInputElement
    const nextDelivery = new Date(value)
    const offset = nextDelivery.getTimezoneOffset() // minutes
    nextDelivery.setMinutes(offset)
    // this.vip.nextDelivery = nextDelivery
    this.setNextDelivery({ nextDelivery, id: this.vip._id })
    this.updateVip(this.vip._id)
  }

  updateFrequency (e: Event) {
    const target = e.target as HTMLInputElement
    const frequency = +target.value
    // this.vip.cycleDays = frequency
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
    this.pickerOpen = false
  }

  pauseVIP () {
    this.setStatus({ id: this.vip._id, status: 'paused' })
  }

  stopVip () {
    this.setStatus({ id: this.vip._id, status: 'stopped' })
  }

  getCost (item: Item) {
    this.pricing.selectedItems = this.vip.items
    this.pricing.pricingTier = this.vip.pricingTier
    return this.pricing.getNextPrice({ item, asVip: true })
  }

  openPicker (clothingType: string) {
    this.chooserClothingType = clothingType
    this.pickerOpen = true
  }
}
</script>

<style scoped>
.panel {
  display: flex;
  margin-bottom: 1rem;
}

.delivery-settings .panel > * {
  flex-grow: 1;
}

.panel > *:first-child {
  margin-right: 1rem;
}

.item-modifier {
  /* max-width: 60rem; */
}

input[type=date] {
  font-size: 1.25rem;
}

/* https://dev.to/_phzn/styling-range-sliders-with-css-4lgl */
input[type=range] {
  -webkit-appearance: none;
  width: 90%;
  background: transparent;
}

input[type=range]:focus {
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
  appearance: none;
  -webkit-appearance: none;
  background: rgba(91, 121, 117, .5);
  height: .125rem;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #5b7975;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  margin: -.45rem;
}

input[type=range]::-moz-range-track {
  background: rgba(91, 121, 117, .3);
}

input[type=range]::-moz-range-progress {
  background: rgb(91, 121, 117);
}

input[type=range]::-moz-range-thumb {
  background: #5b7975;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: none;
}

output {
  background-color: rgba(91, 121, 117, .8);
  color: white;
  padding: .5rem 1rem;
}

.delivery-settings, .items {
  padding: 1rem;
  border-bottom: 24px solid rgba(0, 0, 0, .1);
}

.vip-items {
  margin: 0;
  padding: 1rem;
  width: 50%;
}

.chooser {
  width: 50%;
}
</style>
