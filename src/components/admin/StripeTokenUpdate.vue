<template>
  <div>
    <div ref="card" />
    <button @click="update">Update</button>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
const stripe = window.Stripe(process.env.VUE_APP_STRIPE_PUBLISHABLE)
const elements = stripe.elements()
let card: any

@Component
export default class StripeTokenUpdate extends Vue {
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

  async handlePaymentInfoChange (e: any) {
    console.log(e)
  }

  async update () {
    const result = await stripe.createToken(card)

    if (result.error) {
      // do some error stuff
    }

    console.log(result.token)
  }
}
</script>
