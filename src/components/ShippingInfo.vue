<template>
  <section id="shipping-info">
    <div v-if="useStoredShippingInfo" class="loggedInShippingInfo">
      <Instructions text="Your Shipping Address" step="1"/>
      <Card>
        <p class="loggedInAs">Logged in as <Chip>{{ user.username }}</Chip></p>
        <Button position="right" inline @click="editStoredShippingAddress">Edit</Button>
        <Address displayOnly v-bind="user.shipping.address" />
      </Card>
    </div>
    <div v-else>
      <fieldset>
        <legend>Shipping Info</legend>
        <TextInput :value="email" required @input="setEmail" @blur="checkUsername" type="email" name="email" label="Email Address" />
        <Banner v-if="isReturningCustomer" title="Welcome Back!" @main="expressCheckout" @secondary="closeBanner">
          <template v-slot:copy>
            Looks like you've ordered from us before! Use express checkout to use your previous info, or continue as normal and we'll link to your account.
          </template>
          <template v-slot:main>
            Express Checkout
          </template>
          <template v-slot:secondary>
            Continue
          </template>
        </Banner>
        <Address @input="updateAddress" v-bind="address" />
      </fieldset>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import Address from './BaseAddress.vue'
import Banner from './BaseBanner.vue'
import Button from './BaseButton.vue'
import Card from './BaseCard.vue'
import Chip from './BaseChip.vue'
import Instructions from './BaseInstructions.vue'
import { State, Getter, Action, Mutation } from 'vuex-class'

@Component({
  components: { TextInput, Address, Banner, Button, Card, Chip, Instructions },
})
export default class ShippingInfo extends Vue {
  @State email: string
  @State((state: any) => state.shipping.address) address: Address
  @State isReturningCustomer: boolean
  @State user: boolean
  @State useStoredShippingInfo: boolean
  @Mutation setEmail: any
  @Mutation editStoredShippingAddress: any
  @Action checkUsername: () => Promise<void>

  updateAddress ($event: FormInputEvent) {
    this.$store.commit('setAddress', {
      location: 'shipping',
      field: $event.name,
      value: $event.value,
    })
  }
  expressCheckout () {
    console.log('expressCheckout')
  }
  closeBanner () {
    console.log('closeBanner')
  }
}
</script>

<style scoped>
section {
  position: relative;
}

.loggedInShippingInfo {
  text-align: left;
}

.loggedInAs {
  margin-top: 0;
}
</style>
