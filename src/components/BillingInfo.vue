<template>
  <section id="billing-info">
    <Instructions text="Your Billing Address" step="2"/>
    <BaseCheckbox @input="setBillingSameAsShipping" label="Billing address is same as shipping"/>
    <fieldset>
      <legend>Billing Info</legend>
      <Address @input="updateAddress" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import BaseCheckbox from './BaseCheckbox.vue'
import Address from './BaseAddress.vue'
import Instructions from './BaseInstructions.vue'
import { mapMutations } from 'vuex'

@Component({
  components: { BaseCheckbox, Address, Instructions },
  methods: { ...mapMutations(['setBillingSameAsShipping']) }
})
export default class BillingInfo extends Vue {
  updateAddress ($event: FormInputEvent) {
    console.log('updateAddress', $event)
    this.$store.commit('setAddress', {
      location: 'billing',
      field: $event.name,
      value: $event.value,
    })
  }
}
</script>

<style scoped>
section {
  position: relative;
}
</style>
