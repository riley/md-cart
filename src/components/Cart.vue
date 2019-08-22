<template>
  <div class="container">
    <div>
      <CartSummary />
      count: {{ count }}
      someComputedValue: {{ someComputedValue }}
      <div class="log-thing">
        <div>
          <p>email: {{ email }}</p>
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
      <ShippingInfo />
      <BillingInfo />
      <PaymentInfo />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import CartSummary from './CartSummary.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import { mapState } from 'vuex'

@Component({
  components: {
    ShippingInfo,
    BillingInfo,
    PaymentInfo,
    CartSummary,
  },
  computed: {
    ...mapState({
      count: (state: any) => state.count,
      email: (state: any) => state.email,
      billing: (state: any) => state.billing.address,
      shipping: (state: any) => state.shipping.address
    })
  }
})
export default class Cart extends Vue {
  get someComputedValue () {
    return 'foo'
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
