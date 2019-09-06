<template>
  <section id="billing-info">
    <Instructions text="Your Billing Address" step="2"/>
    <BaseCheckbox @input="setBillingSameAsShipping" :checked="billingSameAsShipping" label="Billing address is same as shipping"/>
    <fieldset v-if="!billingSameAsShipping">
      <legend>Billing Info</legend>
      <Address v-bind="address" @input="updateAddress" />
    </fieldset>
  </section>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import BaseCheckbox from './BaseCheckbox.vue'
import Address from './BaseAddress.vue'
import Instructions from './BaseInstructions.vue'
import { mapMutations, mapState } from 'vuex'

@Component({
  components: { BaseCheckbox, Address, Instructions },
  computed: {
    ...mapState({
      address: (state: any) => state.billing.address,
      billingSameAsShipping: (state: any) => state.billingSameAsShipping,
    })
  },
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
