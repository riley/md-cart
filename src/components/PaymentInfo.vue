<template>
  <section id="payment-info">
    <Instructions text="Your Payment Method" step="3"/>
    <Notification v-if="paymentErrorMessage" type="error" :message="paymentErrorMessage" />
    <Card v-if="useStoredPaymentInfo" class="use-stored-payment-info">
      <CardContent>
        <Button inline position="right" @click="editStoredPaymentInfo">Edit</Button>
        <div class="stored-payment-info">
          •••• •••• •••• {{ user.cardMeta.lastFour }}<br>
          {{ user.cardMeta.expMonth }} / {{ user.cardMeta.expYear }}
        </div>
      </CardContent>
    </Card>
    <div class="stripe-input" :class="{success}" ref="card" :style="{ display: useStoredPaymentInfo ? 'none' : 'block' }"></div>
    <Button
      @click="purchase"
      :loading="processing"
      :disabled="processing">{{ processing ? 'PROCESSING' : 'CHECKOUT' }}</Button>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { State, Mutation, namespace } from 'vuex-class'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'
import Instructions from './BaseInstructions.vue'
import Notification from './BaseNotification.vue'
import Button from './BaseButton.vue'

const cart = namespace('cart')
const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE)
const elements = stripe.elements()
let card: any

@Component({
  components: { Instructions, Notification, Button, Card, CardContent }
})
export default class PaymentInfo extends Vue {
  @cart.State processing: boolean
  @cart.State useStoredPaymentInfo: boolean
  @cart.State user: User
  @cart.Mutation setProcessing: any
  @cart.Mutation editStoredPaymentInfo: boolean
  @cart.Action attemptPurchase: (token: string) => Promise<void>

  paymentErrorMessage: string | null = null
  success: boolean = false

  mounted () {
    card = card || elements.create('card', {
      hidePostalCode: true,
      style: {
        base: {
          fontFamily: '"Open Sans", "Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
        }
      }
    })
    card.on('change', this.handlePaymentInfoChange)
    card.mount(this.$refs.card)
  }

  handlePaymentInfoChange (e: any) {
    this.success = e.complete
  }

  async purchase () {
    this.setProcessing(true)
    const result = await stripe.createToken(card)
    console.log('stripe token result', result)

    if (result.error) {
      this.paymentErrorMessage = result.error.message
      this.$forceUpdate() // force the DOM to update so Stripe can update
      this.setProcessing(false)
      return
    }

    this.attemptPurchase(result.token)
  }
}
</script>

<style scoped>
section {
  position: relative;
  margin-bottom: 1.5rem;
  padding: 1.5rem;
  background: #fff;
}

.stored-payment-info {
  text-align: left;
  padding-left: 1rem;
  line-height: 1.6em;
  border-left: 5px solid rgba(0, 0, 0, .2);
}

.use-stored-payment-info {
  margin-bottom: 1rem;
}

.stripe-input {
  margin-bottom: 2rem;
  border-bottom: 1px solid rgb(30, 48, 10);
  padding: .25rem 0;
}

.stripe-input.success {
  border-bottom-color: rgb(40, 214, 106);
}
</style>
