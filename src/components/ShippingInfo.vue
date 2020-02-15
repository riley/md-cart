<template>
  <section id="shipping-info">
    welcomeBackCardDismissed {{ welcomeBackCardDismissed }}<br>
    isReturningCustomer {{ isReturningCustomer }}<br>
    returningVipCustomer {{ returningVipCustomer }}<br>
    userLoggedIn {{ userLoggedIn }}<br>
    bundle isVip {{ isVip }}<br>
    <LoginForm v-if="loginFormActive" :loginErrorMessage="loginErrorMessage" :loginEmailRequested="loginEmailRequested" @close="clearLoginForm" />
    <p class="login-prompt">
      <span v-if="!userLoggedIn">Ordered from us before?
        <Button class="login-button" inline @click="toggleLoginForm(true)">Login</Button>
      </span>
      <Button xlass="logout-button" v-else inline @click="logout">Logout</Button>
    </p>
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
        <Address @input="updateAddress" @replaceAddress="replaceShippingAddress" v-bind="address" />
      </fieldset>
    </form>

    <!-- for a non-vip returning customer -->
    <Banner
      v-if="isReturningCustomer && !returningVipCustomer && !userLoggedIn && !welcomeBackCardDismissed"
      title="Welcome Back!"
      @main="toggleLoginForm(true)"
      @secondary="welcomeBackCardDismissed = true"
      class="welcome-back">
      <template v-slot:copy>
        Looks like you've ordered from us before! Log in to use your previous info, or continue as normal and we'll link to your account.
      </template>
      <template v-slot:main>
        Log In
      </template>
      <template v-slot:secondary>
        Close
      </template>
    </Banner>

  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'
import Address from './BaseAddress.vue'
import Banner from './BaseBanner.vue'
import Button from './BaseButton.vue'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'
import Chip from './BaseChip.vue'
import Instructions from './BaseInstructions.vue'
import LoginForm from './LoginForm.vue'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'

const cart = namespace('cart')

@Component({
  components: { TextInput, Address, Banner, Button, Card, CardContent, Chip, Instructions, LoginForm },
})
export default class ShippingInfo extends Vue {
  @cart.State((state: any) => state.shipping.address) address: Address
  @cart.State email: string
  @cart.State isReturningCustomer: boolean
  @cart.State isVip: boolean
  @cart.State returningVipCustomer: boolean
  @cart.State loginEmailRequested: boolean
  @cart.State loginFormActive: boolean
  @cart.State loginErrorMessage: string
  @cart.State user: boolean
  @cart.State useStoredShippingInfo: boolean
  @cart.Getter userLoggedIn: string
  @cart.Mutation setEmail: any
  @cart.Mutation setAddress: any
  @cart.Mutation replaceShippingAddress: any
  @cart.Mutation toggleLoginForm: any
  @cart.Mutation clearLoginForm: any
  @cart.Mutation editStoredShippingAddress: any
  @cart.Action logout: any
  @cart.Action checkUsername: (email: string) => Promise<void>
  @cart.Action updateCart: () => Promise<void>

  welcomeBackCardDismissed: boolean = false

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
  background: white;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.welcome-back {
  margin-bottom: 1rem;
}

.login-prompt {
  margin: 0 0 .5rem 0;
  text-align: right;
}

.loggedInShippingInfo {
  text-align: left;
}

.loggedInShippingInfo + .banner {
  margin-top: 1rem;
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
