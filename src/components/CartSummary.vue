<template>
  <div>
    Cart Summary
    <ul class="cart-items">
      <CartItem v-for="item in items" :key="item.sku" v-bind="item" />
    </ul>
    <ul class="totals">
      <li>
        <span>Order Subtotal</span>
        <span>${{ subtotal }}</span>
      </li>
      <li>
        <span>Shipping</span>
        <span>${{ postage }}</span>
      </li>
      <li v-if="discount > 0" class="discount">
        <span>Mr. Davis Rewards</span>
        <span>-${{ discount }}</span>
      </li>
      <li v-if="referDiscountEligible" class="discount">
        <span>Refer Discount</span>
        <span>-$10</span>
      </li>
      <li v-if="tax > 0">
        <span>Tax</span>
        <span>${{ tax }}</span>
      </li>
      <li class="grandTotal">
        <span>Total</span>
        <span>${{ grandTotal }}</span>
      </li>
    </ul>
    <BaseDropdown label="" :options="rates" @input="handleShippingServiceChange" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseDropdown from './BaseDropdown.vue'
import Chooser from './Chooser.vue'
import CartItem from './CartItem.vue'
import { mapState, mapActions, mapMutations } from 'vuex'

@Component({
  components: { Chooser, CartItem, BaseDropdown },
  computed: {
    ...mapState({
      items: (state: any) => {
        return state.items.reduce((carry: Item[], item: Item) => {
          const existingSkuIndex = carry.findIndex(aggItem => aggItem.sku === item.sku)
          const product = state.stock.find((product: Product) => product.sku === item.sku)
          if (existingSkuIndex === -1) {
            carry.push({ ...product, quantity: 1, cost: item.cost })
          } else {
            carry[existingSkuIndex].quantity += item.quantity
            carry[existingSkuIndex].cost += item.cost
          }
          return carry
        }, [])
      },
      postage: (state: any) => state.shipping.postage / 100,
      rates: (state: any) => {
        return state.shipping.rates.reduce((carry: any, rate: ShippingRate) => {
          carry[`${rate.service} - (${rate.est_delivery_days} days): ${rate.postage === 0 ? 'Free' : `$${rate.postage / 100}`}`] = rate.service
          return carry
        }, {})
      },
      subtotal: (state: any) => state.subtotal / 100,
      tax: (state: any) => state.totalTax / 100
    }),
    discount () {
      return this.$store.getters.totalDiscount
    },
    referDiscountEligible () {
      return this.$store.getters.referDiscountEligible
    },
    grandTotal () {
      return this.$store.getters.grandTotal / 100
    }
  },
  methods: {
    ...mapMutations(['setSelectedShippingService']),
    ...mapActions(['updateCart'])
  }
})
export default class CartSummary extends Vue {
  @Prop() stock!: Product[]

  handleShippingServiceChange ($value: string) {
    this.setSelectedShippingService($value)
    this.updateCart()
  }
}
</script>

<style scoped>
.cart-items {
  padding: 0;
}

.totals {
  padding: 0;
}

.totals li {
  display: flex;
  justify-content: space-between;
  line-height: 1.5em;
  color: #555;
}

.totals li.discount {
  color: #3f58fc;
}
</style>
