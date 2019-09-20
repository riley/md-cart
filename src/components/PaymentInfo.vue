<template>
  <section id="payment-info">
    <Instructions text="Your Payment Method" step="3"/>
    <Card v-if="useStoredPaymentInfo">
      <Button inline position="right" @click="editStoredPaymentInfo">Edit</Button>
      <div class="stored-payment-info">
        •••• •••• •••• {{ user.cardMeta.lastFour }}<br>
        {{ user.cardMeta.expMonth }} / {{ user.cardMeta.expYear }}
      </div>
    </Card>
    <div ref="card" :style="{ display: useStoredPaymentInfo ? 'none' : 'block' }"></div>
    <Button @click="purchase">Checkout</Button>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Mutation } from 'vuex-class'
import Card from './BaseCard.vue'
import Instructions from './BaseInstructions.vue'
import Button from './BaseButton.vue'

const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE)
const elements = stripe.elements()
let card: any

@Component({
  components: { Instructions, Button, Card }
})
export default class PaymentInfo extends Vue {
  @State useStoredPaymentInfo: boolean
  @State user: User
  @Mutation editStoredPaymentInfo: boolean

  hasCardErrors: boolean = false

  mounted () {
    card = card || elements.create('card')
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

.stored-payment-info {
  text-align: left;
  padding-left: 1rem;
  line-height: 1.6em;
  border-left: 5px solid rgba(0, 0, 0, .2);
}
</style>
