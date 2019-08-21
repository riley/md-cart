<template>
  <section id="billing-info">
    <Instructions text="Your Billing Address" step="2"/>
    <fieldset>
      <legend>Billing Info</legend>
      <Address :address="address" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Address from './BaseAddress.vue'
import Instructions from './BaseInstructions.vue'

@Component({
  components: { Address, Instructions }
})
export default class BillingInfo extends Vue {
  @Prop() address!: Address;
}
</script>

<style scoped>
section {
  position: relative;
}
</style>
