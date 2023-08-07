<template>
  <div class="vip" @click="$emit('vipSelected', _id)">
    <div class="thumbs">
      <Thumb
        v-for="(product, index) of Object.values(groupedProducts).slice(0, 3)"
        class="thumb"
        :style="{top: `${index * 5}px`, left: `${index * 5}px`}"
        :key="product.sku"
        :icon="product.icon" />
    </div>
    <span class="status-icon checkmark-icon" v-if="status === 'active'">
      <svg aria-hidden="true" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><polyline class="step-completed-checkmark" points="2.5,9.5 7.5,14.5 17.5,4.5"></polyline></svg>
    </span>
    <span class="status-icon x-icon" v-if="status === 'stopped'">
      <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M14.5,5.5 L5.5,14.5 M5.5,5.5 L14.5,14.5"></path></svg>
    </span>
    <span class="status-icon pause-icon" v-if="status === 'paused'">
      <svg aria-hidden="true" viewBox="0 0 20 20"><path d="M7,5 L7,14 M13,5 L13,14"></path></svg>
    </span>
    <span class="status-icon cc-icon" v-if="status === 'error'">
      <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 96 960 960" width="20"><path d="M864 360v432q0 29-21.15 50.5T792 864H168q-29 0-50.5-21.5T96 792V360q0-29 21.5-50.5T168 288h624q29.7 0 50.85 21.5Q864 331 864 360Zm-696 72h624v-72H168v72Zm0 144v216h624V576H168Zm0 216V360v432Z"/></svg>
    </span>
    <div :data-id="_id" class="delivery-info">
      <span class="next-order-date" v-if="status === 'active'">Next Order</span>
      <span class="next-order-date" v-if="status === 'paused'">Paused</span>
      <span class="next-order-date stopped" v-if="status === 'stopped'">Stopped</span>
      <span class="next-order-date" v-if="status === 'error'">Please update your <a href="/user/account-settings" @click="handleBillingInfoUpdate" class="update-billing-cta">credit card information</a>.</span>
      <br>
      <span v-if="status === 'active' || status === 'paused'"><span v-if="status === 'active'">{{ months[nextDelivery.getMonth()] }} {{ nextDelivery.getDate() }}, {{ nextDelivery.getFullYear() }} - </span></span>{{ items.length }} items
      <br>
      Delivery Frequency: Every {{ cycleDays }} days
    </div>
    <div>
      <Pencil class="icon" />
      <button class="edit">Edit</button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Thumb from '../BaseSkuThumb.vue'
import Pencil from '../icons/pencil.vue'

@Component({ components: { Thumb, Pencil } })
export default class VipThumb extends Vue {
  @Prop() items: Item[]
  @Prop() _id: string
  @Prop() nextDelivery: Date
  @Prop() cycleDays: number
  @Prop() status: string
  @Prop() stock: Product[]

  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  get groupedProducts () {
    return this.items.reduce((carry: any, item: Item) => {
      if (carry[item.sku]) {
        carry[item.sku].quantity += 1
      } else {
        const product = this.stock.find((product: Product) => product.sku === item.sku)
        carry[item.sku] = { ...product, quantity: 1 }
      }
      return carry
    }, {})
  }

  handleBillingInfoUpdate (e: Event) {
    e.stopPropagation()
    e.preventDefault()
    this.$router.push({ name: 'accountSettings' })
  }
}
</script>

<style scoped>
.vip {
  display: flex;
  min-height: 6rem;
  cursor: pointer;
  align-items: flex-start;
}

.delivery-info {
  flex-grow: 1;
}

.update-billing-cta {
  text-decoration: underline;
  cursor: pointer;
  color: black;
}

.status-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  min-width: 1.875rem;
  height: 1.875rem;
  margin-right: 1rem;
}

.status-icon svg {
  width: 0.9375rem;
  height: 0.9375rem;
  margin-top: 1px;
  fill: transparent;
}

.checkmark-icon {
  border: 1px solid rgb(46, 132, 89);
}

.checkmark-icon svg {
  stroke: rgb(46, 132, 89);
}

.x-icon, .cc-icon {
  border: 1px solid rgb(255, 0, 0);
}

.x-icon svg {
  stroke: rgb(255, 0, 0);
}

.cc-icon {
  border: 1px solid hsla(8,100%,70%,.99);
}

.cc-icon svg {
  fill: hsla(8,100%,70%,.99);
}

.pause-icon {
  border: 1px solid hsla(8,100%,70%,.99);
}

.pause-icon svg {
  stroke: hsla(8,100%,70%,.99);
}

.cc-icon svg {
  font-variation-settings:
  'FILL' 0,
  'wght' 400,
  'GRAD' 0,
  'opsz' 20
}

.next-order-date {
  font-weight: bold;
  color: #5b7975;
  margin-bottom: .5rem;
  display: inline-block;
}

.next-order-date.stopped {
  color: hsla(8,100%,70%,.99);
}

.edit {
  border: 0;
  background: transparent;
  border-bottom: 0.0625rem solid rgba(33, 43, 100, 0.25);
  text-decoration: none;
  display: inline-block;
  transition: all .2s ease 0s;
  cursor: pointer;
  font-size: 1.3em;
}

.edit:hover {
  border-bottom-color: rgb(30, 48, 110);
}

.thumbs {
  min-width: 7rem;
  position: relative;
  flex-grow: 0;
}

.thumb {
  border: 1px solid #ccc;
  position: absolute;
  background-color: white;
}

.icon {
  fill: rgba(0, 0, 0, .5);
  top: 4px;
  position: relative;
}
</style>
