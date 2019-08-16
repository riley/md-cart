<template>
  <div class="container">
    <div>
      <Chooser />
      <div class="log-thing">
        <div>
          <p>shipping</p>
          <ul>
            <li v-for="(value, fieldName) in shipping" v-bind:key="fieldName">{{ fieldName }}: {{ value }}</li>
          </ul>
        </div>
        <div>
          <p>billing</p>
          <ul>
            <li v-for="(value, fieldName) in billing" v-bind:key="fieldName">{{ fieldName }}: {{ value }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div>
      <ShippingInfo :address="shipping" />
      <BillingInfo :address="billing" />
      <PaymentInfo />
      <FormButton>Checkout</FormButton>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Chooser from './Chooser.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import FormButton from './FormButton.vue'

@Component({
  components: {
    ShippingInfo,
    BillingInfo,
    FormButton,
    PaymentInfo,
    Chooser,
  }
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
.container {
  display: flex;
  max-width: 100rem;
  margin: 0 auto;
}

.container > div {
  flex: 1;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}

legend {
  visibility: hidden;
  height: 0;
}

.log-thing {
  display: flex;
  min-width: 400px;
  background: darkslateblue;
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
}
.log-thing > div {
  flex: 1;
}
</style>
