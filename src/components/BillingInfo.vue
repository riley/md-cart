<template>
  <section id="billing-info">
    <Instructions text="Your Billing Address" step="2"/>
    <div v-if="useStoredBillingInfo" class="loggedInBillingInfo">
      <Card>
        <Button inline position="right" @click="editStoredShippingAddress">Edit</Button>
        <Address displayOnly v-bind="user.billing.address" />
      </Card>
    </div>
    <div v-else>
      <Checkbox @input="setBillingSameAsShipping" :checked="billingSameAsShipping" label="Billing address is same as shipping"/>
      <fieldset v-if="!billingSameAsShipping">
        <legend>Billing Info</legend>
        <Address v-bind="address" @input="updateAddress" />
      </fieldset>
    </div>
  </section>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Checkbox from './BaseCheckbox.vue'
import Address from './BaseAddress.vue'
import Button from './BaseButton.vue'
import Card from './BaseCard.vue'
import Instructions from './BaseInstructions.vue'
import { State, Mutation } from 'vuex-class'

@Component({
  components: { Button, Card, Checkbox, Address, Instructions }
})
export default class BillingInfo extends Vue {
  @State((state: any) => state.billing.address) address: Address
  @State billingSameAsShipping: boolean
  @State useStoredBillingInfo: boolean
  @State user: User
  @Mutation setBillingSameAsShipping: () => void
  @Mutation editStoredShippingAddress: () => void

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

.loggedInBillingInfo {
  text-align: left;
}
</style>
