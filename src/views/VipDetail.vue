<template>
  <div v-if="loggedIn && _id" id="vip-detail">
    <button class="vip-list-nav" @click="navToVipList">← Back to VIP List</button>
    <Heading>Edit Your Subscription Below <span v-if="status === 'stopped'">(Stopped)</span></Heading>
    <Card class="item-modifier">
      <div class="delivery-settings">
        <div class="panel">
          <div>
            <label class="delivery-date-label">
              <span class="label-text">Edit Next Processing Date</span>
              <input
                placeholder="yyyy-mm-dd"
                class="next-delivery"
                type="date"
                :min="dateRange.start"
                :max="dateRange.end"
                :value="formattedDate"
                @change="updateNextDelivery" />
            </label>
            <Dropdown
              :value="cycleDays"
              @input="updateFrequency"
              label="Edit Delivery Frequency"
              :options="periods"
              name="Delivery Frequency" />
          </div>
          <Card class="send-now">
            <CardContent>
              <h4>Need this shipment now?</h4>
              <p class="send-now-cta">Click below to check out. We'll automatically adjust the date of your next shipment.</p>
              <Button @click="populateFromVIP(_id)" class="send-now-button">Proceed to Checkout</Button>
            </CardContent>
          </Card>
          <div class="status-buttons">
            <Button @click="resumeVip" inline variant="brand" v-if="status === 'stopped' || status === 'paused'">Restart VIP</Button>
            <button @click="pauseDialogActive = true" class="pause-vip" v-if="status === 'active'">Pause VIP for 180 days</button>
            <p v-if="status === 'active' || status === 'paused'" class="or">or</p>
            <button @click="cancelDialogActive = true" class="stop-vip" v-if="status === 'active' || status === 'paused'">Cancel VIP</button>
          </div>
        </div>
      </div>
      <div class="items">
        <h4>Change the Contents of Your Next Delivery</h4>
        <div class="panel">
          <div class="vip-items">
            <ul>
              <ItemListItem
                v-for="item of groupedItems"
                inverse
                :key="item.sku"
                v-bind="item"
                @increment="incrementItem" />
            </ul>
            <p class="vip-total"><strong>Total Price:</strong> ${{ vipPrice / 100 }} (Retail Price: ${{ vipRetailCost / 100 }}. Save {{ Math.round((1 - vipPrice / vipRetailCost) * 100) }}%)</p>
          </div>
          <div class="chooser" v-if="pickerOpen">
            <Chooser
              vipPricing
              :upsells="upsells"
              :stock="stock"
              :clothingType="chooserClothingType"
              @abort="pickerOpen = false"
              @chosenProduct="chosenProduct" />
          </div>
          <div v-if="!pickerOpen" class="add-more-prompt">
            <h4 class="add-clothing">
              <svg width="16px" height="16px" viewBox="0 0 16 16">
                <path d="M 3 8 L 8 13 L 13 8 M 8 13 L 8 3" />
              </svg>
              Add more items to your next shipment and save.
            </h4>
            <div class="add-more-buttons">
              <Upsell
                class="upsell"
                v-for="upsell in upsells"
                :key="upsell.clothingType"
                :price="getCost(upsell)"
                :retailPrice="getItemRetailCost(upsell)"
                :upsell="upsell"
                cta="See Options"
                @select="openPicker(upsell.clothingType)" />
            </div>
          </div>
        </div>
      </div>
      <Dialog
        v-if="cancelDialogActive"
        title="Are you sure?"
        message="are you sure you want to cancel message?"
        confirmText="Yes, cancel my VIP"
        cancelText="Nevermind"
        @confirm="stopVip"
        @cancel="cancelDialogActive = false">
        <ul>
          <li>By canceling you lose your VIP discount and free US shipping on every order.</li>
          <li>You also lose price protection. VIPs get to keep today’s price forever as long as they do not cancel.</li>
        </ul>
      </Dialog>
      <Dialog
        v-if="pauseDialogActive"
        title="Are you sure?"
        message="are you sure you want to pause message?"
        confirmText="Yes, pause my VIP"
        cancelText="Nevermind"
        @confirm="pauseVIP"
        @cancel="pauseDialogActive = false">
        <p>Click here to confirm you want to pause your VIP for 180 days.</p>
      </Dialog>
      <Snackbar :active.sync="confirmedVipUpdate">Your VIP has been updated!</Snackbar>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Prop, Component } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import Card from '@/components/BaseCard.vue'
import CardContent from '@/components/BaseCardContent.vue'
import Chooser from '@/components/Chooser.vue'
import Dialog from '@/components/BaseDialog.vue'
import Dropdown from '@/components/BaseDropdown.vue'
import ItemListItem from '@/components/ItemListItem.vue'
import Heading from '@/components/BaseHeading.vue'
import Upsell from '@/components/Upsell.vue'
import Pricing from '../utils/Pricing'
import Button from '@/components/BaseButton.vue'
import Snackbar from '@/components/snackbar/BaseSnackbar.vue'

const user = namespace('user')
const cart = namespace('cart')
const vip = namespace('vip')

@Component({ components: { Button, Card, CardContent, Chooser, Dialog, Dropdown, ItemListItem, Heading, Snackbar, Upsell } })
export default class VipDetail extends Vue {
  @State vipMap: VipMap
  @State stock: Product[]
  @State upsells: UpsellData[]
  @user.Getter loggedIn: boolean

  @vip.State _id: string
  @vip.State cycleDays: number
  @vip.State items: Item[]
  @vip.State nextDelivery: Date
  @vip.State pricingTier: number
  @vip.State status: string
  @vip.State vipPrice: number
  @vip.Mutation setNextDelivery: (nextDelivery: Date) => void
  @vip.Mutation setCycleDays: (cycleDays: number) => void
  @vip.Mutation addItem: (item: Item) => void
  @vip.Mutation removeItem: (sku: string) => void
  @vip.Mutation setStatus: (status: string) => void
  @vip.Mutation setVip: (vip: VIP) => void

  @vip.Action updateVip: () => Promise<void>
  @cart.Action populateFromVIP: (_id: string) => void

  cancelDialogActive: boolean = false
  pauseDialogActive: boolean = false
  chooserClothingType: string = 'undershirts'
  confirmedVipUpdate: boolean = false

  pickerOpen = false
  pricing: Pricing

  periods = {
    'Every 30 days': 30,
    'Every 60 days': 60,
    'Every 90 days': 90,
    'Every 120 days': 120,
    'Every 180 days': 180, // this is actually a pause
  }

  constructor () {
    super()
    this.pricing = new Pricing(true)
  }

  mounted () {
    const vip = this.vipMap[this.$route.params.id]
    if (vip) this.setVip(vip)
  }

  @Watch('vipMap')
  displayVip () {
    const vip = this.vipMap[this.$route.params.id]
    if (vip) this.setVip(vip)
  }

  get dateRange () {
    const end = new Date()
    end.setDate(end.getDate() + 180)
    const today = new Date()
    return {
      start: `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`,
      end: `${end.getFullYear()}-${(end.getMonth() + 1).toString().padStart(2, '0')}-${end.getDate().toString().padStart(2, '0')}`
    }
  }

  get groupedItems () {
    return this.items.reduce((carry: any, item: Item) => {
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
    const d = this.nextDelivery
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

  async updateNextDelivery (e: Event) {
    const { value } = e.target as HTMLInputElement
    const nextDelivery = new Date(value)
    const offset = nextDelivery.getTimezoneOffset() // minutes
    nextDelivery.setMinutes(offset)
    this.setNextDelivery(nextDelivery)
    await this.updateVip()
    this.showSnackbar()
  }

  async updateFrequencyVisual (e: Event) {
    const target = e.target as HTMLInputElement
    const frequency = +target.value
    this.setCycleDays(frequency)
    await this.updateVip()
    this.showSnackbar()
  }

  async updateFrequency (value: string) {
    const frequency = +value
    this.setCycleDays(frequency)
    await this.updateVip()
    this.showSnackbar()
  }

  async incrementItem ({ amount, sku }: { amount: number, sku: string }) {
    const skuCount = this.items.filter((item: Item) => item.sku === sku).length
    if (amount < skuCount) {
      this.removeItem(sku)
      console.log('sku', sku)
    } else {
      console.log('amount', amount, 'sku', sku)
      const product = this.stock.find((product: Product) => product.sku === sku)
      if (!product) {
        console.error('failed to find sku', sku)
        throw new Error(`failed to find sku ${sku}`)
      }
      const item = { quantity: 1, sku, clothingType: product.clothingType, cost: 0 }
      console.log('adding item', item)
      this.addItem(item)
      console.log('item', item)
    }

    await this.updateVip()
    this.showSnackbar()
  }

  async chosenProduct (product: Product) {
    this.addItem({ quantity: 1, sku: product.sku, clothingType: product.clothingType, cost: 0 })
    await this.updateVip()
    this.showSnackbar()
    this.pickerOpen = false
  }

  async pauseVIP () {
    try {
      this.setStatus('paused')
      await this.updateVip()
      this.showSnackbar()
      this.pauseDialogActive = false
      this.$router.push({ name: 'vipList' })
    } catch (e) {
      // set an error
      console.log('error', e)
    }
  }

  async stopVip () {
    try {
      this.setStatus('stopped')
      await this.updateVip()
      this.cancelDialogActive = false
      this.showSnackbar()
    } catch (e) {

    }
  }

  async resumeVip () {
    try {
      this.setStatus('active')
      await this.updateVip()
      this.showSnackbar()
    } catch (e) {

    }
  }

  getCost (item: Item) {
    this.pricing.selectedItems = this.items
    this.pricing.pricingTier = this.pricingTier
    return this.pricing.getNextPrice({ item, asVip: true }).nextItemPrice
  }

  getItemRetailCost (item: Item) {
    return this.pricing.getBaseSingle({ clothingType: item.clothingType, sku: item.sku })
  }

  get vipRetailCost () {
    return this.items.reduce((carry: number, item: Item) => {
      return carry + this.getItemRetailCost(item)
    }, 0)
  }

  openPicker (clothingType: string) {
    this.chooserClothingType = clothingType
    this.pickerOpen = true
    this.$nextTick(() => {
      document.querySelector('.chooser-cta')?.scrollIntoView()
    })
  }

  navToVipList () {
    this.$router.push({ name: 'vipList' })
  }

  showSnackbar () {
    this.confirmedVipUpdate = true
    setTimeout(() => { this.confirmedVipUpdate = false }, 3000)
  }
}
</script>

<style scoped>
.panel {
  display: flex;
  margin-bottom: 1rem;
  gap: 1rem;
}

.label-text {
  font-style: normal;
  font-weight: 400;
  font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
  letter-spacing: 0.0375rem;
  color: rgb(163, 163, 163);
  pointer-events: none;
  padding: 0.25rem 0px;
  transition: transform 0.3s ease-out 0s;
  transform: translateY(-1.5rem) scale(.8);
}

.delivery-date-label {
  display: block;
  margin-bottom: 1rem;
}

.delivery-settings .panel > * {
  flex-grow: 1;
}

.panel > *:first-child {
  margin-right: 1rem;
}

.send-now {
  max-width: 20rem;
}

.send-now-cta {
  margin-bottom: .5rem;
  padding: 0;
}

.item-modifier {
  /* max-width: 60rem; */
}

.add-clothing svg {
  stroke: rgb(91, 121, 117);
  stroke-linecap: round;
  stroke-width: 2px;
  fill: none;
  position: relative;
  top: 2px;
  transform: rotate(-17deg);
}

.or {
  padding: 1rem 0;
}

.pause-vip {
  border: 0;
  background: transparent;
  border-bottom: 0.0625rem solid rgba(33, 43, 100, 0.25);
  text-decoration: none;
  display: inline-block;
  transition: all .2s ease 0s;
  cursor: pointer;
  font-size: 1.2em;
}

.stop-vip {
  border: 0;
  background: transparent;
  border-bottom: 0.0625rem solid rgba(33, 43, 100, 0.25);
  text-decoration: none;
  display: inline-block;
  transition: all .2s ease 0s;
  cursor: pointer;
  font-size: .9em;
}

input[type=date] {
  font-size: 1.25rem;
  margin-bottom: 1rem;
}

/* https://dev.to/_phzn/styling-range-sliders-with-css-4lgl */
input[type=range] {
  -webkit-appearance: none;
  appearance: none;
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
  margin-left: 1rem;
}

.status-buttons {
  display: flex;
  align-items: end;
  flex-direction: column;
}

.delivery-settings {
  border-bottom: 24px solid rgba(0, 0, 0, .1);
}

.delivery-settings, .items {
  padding: 1rem;
}

.vip-total {
  padding-bottom: 0;
  font-size: 1rem;
  text-align: right;
}

.vip-items {
  padding: 1rem;
  width: 50%;
}

.vip-items ul {
  margin: 0 0 1rem 0;
}

.upsell {
  margin-bottom: .5rem;
}

.chooser, .add-more-prompt {
  width: 50%;
}

.vip-list-nav {
  background: none;
  color: inherit;
  border: none;
  padding: 0;
  font: inherit;
  cursor: pointer;
  outline: inherit;
  float: right;
}

@media (max-width: 50rem) {
  .panel {
    flex-direction: column;
  }

  .vip-items, .add-more-prompt, .chooser {
    width: auto;
  }

  .send-now {
    max-width: none;
    margin-bottom: 1rem;
  }
}
</style>
