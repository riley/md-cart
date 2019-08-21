<template>
  <section>
    <Instructions text="Your Payment Method" step="3"/>
    <div ref="card"></div>
    <Button @click="purchase">Checkout</Button>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Instructions from './BaseInstructions.vue'
import Button from './BaseButton.vue'

console.log(process.env)
console.log(process.env.VUE_APP_STRIPE_PUBLISHABLE)

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE)
const elements = stripe.elements()
let card: any

@Component({
  components: { Instructions, Button }
})
export default class PaymentInfo extends Vue {
  hasCardErrors: boolean = false

  mounted () {
    card = elements.create('card')
    card.mount(this.$refs.card)
  }

  async purchase () {
    const result = await stripe.createToken(card)

    if (result.error) {
      this.hasCardErrors = true
      this.$forceUpdate() // force the DOM to update so Stripe can update
      return
    }

    console.log(result.token.id)
    console.log(result)
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>
