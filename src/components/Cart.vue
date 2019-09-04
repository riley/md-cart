<template>
  <div class="container">
    <CartSummary />
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
import { mapState, mapActions } from 'vuex'

@Component({
  components: {
    ShippingInfo,
    BillingInfo,
    PaymentInfo,
    CartSummary,
  },
  computed: {
    ...mapState({
      stock: (state: any) => state.stock
    })
  },
  methods: {
    ...mapActions(['fetchStock', 'fetchCart'])
  }
})
export default class Cart extends Vue {
  async mounted () {
    await this.fetchStock()
    this.fetchCart()
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
