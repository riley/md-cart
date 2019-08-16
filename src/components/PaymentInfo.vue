<template>
  <section>
    <Instructions text="Your Payment Method" step="3"/>
    <div ref="card"></div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Instructions from './Instructions.vue'

const stripe = Stripe('pk_ezbOiu560q35i5EtPztEsAT4uSAjW')
const elements = stripe.elements()
let card

@Component({
  components: { Instructions }
})
export default class PaymentInfo extends Vue {
  mounted () {
    card = elements.create('card')
    card.mount(this.$refs.card)
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>
