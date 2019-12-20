<template>
  <div>
    <h2>Customer Information</h2>
    <div class="info-container">
      <div class="contact-information">
        <h4>Contact Information</h4>
        <p>{{ email }}</p>
      </div>
      <div class="payment-method">
        <h4>Payment Method</h4>
        <div v-html="cardImage"></div>
      </div>
      <div class="shipping-address">
        <h4>Shipping Address</h4>
        <Address displayOnly v-bind="shipping" />
      </div>
      <div class="billing-address">
        <h4>Billing Address</h4>
        <Address displayOnly v-bind="billing" />
      </div>
      <div class="shipping-method">
        <h4>Shipping Method</h4>
        <p>{{ shippingMethod }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import Address from './BaseAddress.vue'

@Component({
  components: { Address }
})
export default class CustomerInfo extends Vue {
  @Prop() email: string
  @Prop() paymentMethod: string
  @Prop() billing: Address
  @Prop() shipping: Address
  @Prop() shippingMethod: string

  get cardImage () {
    console.log('get cardImage', this.paymentMethod)
    if (['amex', 'jcb', 'discover', 'mastercard', 'visa', 'diners'].includes(this.paymentMethod)) {
      return `<img width="64" height="40" srcset src="/img/${this.paymentMethod}.png" />`
    } else {
      return this.paymentMethod
    }
  }
}
</script>

<style scoped>
h2 { margin-top: 0; }

.shipping-address, .billing-address {
  margin-bottom: 15px;
}

.info-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
}
</style>
