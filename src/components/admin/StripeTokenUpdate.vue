<template>
  <div class="stripe-token-update">
    <div class="stripe-input" ref="card" />
    <ButtonTray>
      <Button inline @click="cancel">Cancel</Button>
      <Button inline variant="primary" @click="update">Update</Button>
    </ButtonTray>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Button from '../BaseButton.vue'
import ButtonTray from '../ButtonTray.vue'
import { stripePublishableKey } from '../../utils/computed'
const stripe = window.Stripe(stripePublishableKey)
const elements = stripe.elements()
let card: any

@Component({ components: { Button, ButtonTray } })
export default class StripeTokenUpdate extends Vue {
  mounted () {
    console.log('StripeTokenUpdate.mounted')
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

  async handlePaymentInfoChange (e: any) {
    console.log(e)
  }

  async update () {
    const result = await stripe.createToken(card)

    if (result.error) {
      // do some error stuff
      this.$emit('error', result.error)
    }

    console.log(result.token)
    this.$emit('token', result.token)
  }

  async cancel () {
    this.$emit('cancel')
  }
}
</script>

<style scoped>
.stripe-input {
  border-bottom: 1px solid rgb(30, 48, 10);
  margin-bottom: 2rem;
  padding: .25rem 0;
}
</style>
