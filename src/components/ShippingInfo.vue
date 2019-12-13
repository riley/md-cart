<template>
  <section id="shipping-info">
    <Instructions text="Your Shipping Address" step="1"/>
    <div v-if="useStoredShippingInfo" class="loggedInShippingInfo">
      <Card>
        <CardContent>
          <p class="loggedInAs">Logged in as <Chip>{{ user.username }}</Chip></p>
          <Button position="right" inline @click="editStoredShippingAddress">Edit</Button>
          <Address displayOnly v-bind="user.shipping.address" />
        </CardContent>
      </Card>
    </div>
    <form v-else @submit.prevent="() => {}">
      <fieldset>
        <legend>Shipping Info</legend>
        <TextInput
          required
          :value="email"
          @input="setEmail"
          @blur="handleBlurEmail"
          type="email"
          name="email"
          label="Email Address" />
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
        <Address @input="updateAddress" @replaceAddress="replaceShippingAddress" v-bind="address" />
      </fieldset>
    </form>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import Address from './BaseAddress.vue'
import Banner from './BaseBanner.vue'
import Button from './BaseButton.vue'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'
import Chip from './BaseChip.vue'
import Instructions from './BaseInstructions.vue'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'

const cart = namespace('cart')

@Component({
  components: { TextInput, Address, Banner, Button, Card, CardContent, Chip, Instructions },
})
export default class ShippingInfo extends Vue {
  @cart.State email: string
  @cart.State((state: any) => state.shipping.address) address: Address
  @cart.State isReturningCustomer: boolean
  @cart.State user: boolean
  @cart.State useStoredShippingInfo: boolean
  @cart.Mutation setEmail: any
  @cart.Mutation setAddress: any
  @cart.Mutation replaceShippingAddress: any
  @cart.Mutation editStoredShippingAddress: any
  @cart.Action checkUsername: (email: string) => Promise<void>
  @cart.Action updateCart: () => Promise<void>

  updateAddress ($event: FormInputEvent) {
    this.setAddress({
      location: 'shipping',
      field: $event.name,
      value: $event.value,
    })

    if ($event.name === 'country') {
      this.updateCart()
    }
  }
  expressCheckout () {
    console.log('expressCheckout')
  }
  closeBanner () {
    console.log('closeBanner')
  }

  handleBlurEmail (email: string) {
    this.checkUsername(email)
    window.woopra && window.woopra.identify({ email })
  }
}
</script>

<style scoped>
section {
  position: relative;
  margin-bottom: 2rem;
}

.loggedInShippingInfo {
  text-align: left;
}

.loggedInAs {
  margin-top: 0;
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
