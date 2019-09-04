<template>
  <div>
    Cart Summary
    <Chooser />
    total: ${{ total }}
    <ul class="cart-items">
      <CartItem v-for="item in items" :key="item.sku" v-bind="item" />
    </ul>
    <BaseDropdown :options="rates" @input="setSelectedShippingService" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import BaseDropdown from './BaseDropdown'
import Chooser from './Chooser.vue'
import CartItem from './CartItem.vue'
import { mapState, mapActions, mapMutations } from 'vuex'

@Component({
  components: { Chooser, CartItem, BaseDropdown },
  computed: {
    ...mapState({
      items: (state: any) => {
        return state.items.reduce((carry, item) => {
          const existingSkuIndex = carry.findIndex(aggItem => aggItem.sku === item.sku)
          const product = state.stock.find(product => product.sku === item.sku)
          if (existingSkuIndex === -1) {
            carry.push({ ...product, quantity: 1, cost: item.cost })
          } else {
            carry[existingSkuIndex].quantity += item.quantity
            carry[existingSkuIndex].cost += item.cost
          }
          return carry
        }, [])
      },
      rates: (state: any) => {
        console.log('state.shipping.rates', state.shipping.rates)
        const ratez = state.shipping.rates.reduce((carry, rate) => {
          carry[`${rate.rate} - ${rate.est_delivery_days}`] = rate.service
          return carry
        }, {})
        console.log('ratez', ratez)
        return ratez
      }
    }),
    total () {
      return this.$store.getters.total / 100
    }
  },
  methods: {
    ...mapMutations(['setSelectedShippingService']),
    ...mapActions(['updateCart'])
  }
})
export default class CartSummary extends Vue {
  @Prop() stock!: Product[]
}
</script>

<style scoped>
.cart-items {
  padding: 0;
}
</style>
