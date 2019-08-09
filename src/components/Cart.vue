<template>
  <div class="container">
    <div class="half">
      <ShippingInfo :address="shipping" />
    </div>
    <div class="half">
      <BillingInfo :address="billing" />
    </div>
    <FormButton>Checkout</FormButton>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import FormButton from './FormButton.vue'

@Component({
  components: { ShippingInfo, BillingInfo, FormButton }
})
export default class Cart extends Vue {
  shipping: Address = {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  }
  billing: Address = {
    name: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  }

  options = [{ label: 'foo', code: 'bar' }, { label: 'baz', code: 'boo' }]

  get totalDiscount () {
    return 0
  }

  // computed price
  get subtotal () {
    return 0
  }
}
</script>

<style>
.half {
  width: 50%;
  float: left;
}
</style>
