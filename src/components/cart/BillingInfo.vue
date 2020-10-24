<template>
  <section id="billing-info">
    <Instructions text="Your Billing Address" step="2"/>
    <div v-if="useStoredBillingInfo" class="loggedInBillingInfo">
      <Card>
        <CardContent>
          <Button inline position="right" @click="editStoredShippingAddress">Edit</Button>
          <Address displayOnly v-bind="userBilling" />
        </CardContent>
      </Card>
    </div>
    <form v-else @submit.prevent="() => {}">
      <Checkbox @input="setBillingSameAsShipping" :checked="billingSameAsShipping" label="Billing address is same as shipping"/>
      <fieldset v-if="!billingSameAsShipping">
        <legend>Billing Info</legend>
        <Address v-bind="address" @input="updateAddress" @replaceAddress="replaceBillingAddress" />
      </fieldset>
    </form>
  </section>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import Checkbox from '../BaseCheckbox.vue'
import Address from '../BaseAddress.vue'
import Button from '../BaseButton.vue'
import Card from '../BaseCard.vue'
import CardContent from '../BaseCardContent.vue'
import Instructions from '../BaseInstructions.vue'
import { State, Mutation, namespace } from 'vuex-class'

const cart = namespace('cart')
const user = namespace('user')

@Component({
  components: { Button, Card, CardContent, Checkbox, Address, Instructions }
})
export default class BillingInfo extends Vue {
  @cart.State((state: any) => state.billing.address) address: Address
  @cart.State billingSameAsShipping: boolean
  @cart.State useStoredBillingInfo: boolean
  @user.State((state: any) => state.shipping.address) userBilling: Address
  @cart.Mutation replaceBillingAddress: any
  @cart.Mutation setAddress: any
  @cart.Mutation setBillingSameAsShipping: () => void
  @cart.Mutation editStoredShippingAddress: () => void

  updateAddress ($event: FormInputEvent) {
    this.setAddress({
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
  margin-bottom: 1.5rem;
  background: #fff;
  padding: 1.5rem;
}

.loggedInBillingInfo {
  text-align: left;
}

fieldset {
  border: 0;
  margin: 0;
  padding: 0;
}

legend {
  visibility: hidden;
  height: 0;
}
</style>
