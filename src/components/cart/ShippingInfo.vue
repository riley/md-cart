<template>
  <section id="shipping-info">
    <p class="login-prompt">
      <span v-if="!loggedIn" @click="toggleLoginForm(true)">Ordered from us before?
        <a class="login-button">Login</a>
      </span>
      <a class="logout-a" v-else inline @click="handleLogoutClicked">Logout</a>
    </p>
    <LoginForm
      v-if="loginFormActive"
      :email="email"
      :loginErrorMessage="loginErrorMessage"
      :loginEmailRequested="loginEmailRequested"
      :clearLoginForm="clearLoginForm"
      :setEmail="setEmail"
      @close="clearLoginForm" />
    <Instructions class="shipping-instructions" text="Your Shipping Address" step="1"/>
    <div v-if="useStoredShippingInfo" class="loggedInShippingInfo">
      <Card>
        <CardContent>
          <p class="loggedInAs">Logged in as <Chip>{{ username }}</Chip></p>
          <Button position="right" inline @click="editStoredShippingAddress">Edit</Button>
          <Address v-bind="userShipping" />
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
          autocomplete="email"
          label="Email Address" />
        <!-- for a non-vip returning customer -->
        <Banner
          v-if="isReturningCustomer && !loggedIn && !welcomeBackCardDismissed"
          variant="brand"
          @main="toggleLoginForm(true)"
          @secondary="welcomeBackCardDismissed = true"
          class="welcome-back">
          <template v-slot:copy>
            Looks like you’ve ordered from us before. Log in to use your saved checkout info, or continue below and we’ll link to your account.
          </template>
        </Banner>
        <Address
          editMode
          @input="updateAddress"
          @blur="handleBlur"
          @replaceAddress="replaceShippingAddress"
          v-bind="address" />
      </fieldset>
    </form>
    <div class="shipping-delay-warning" v-if="!['US', 'CA', 'GB'].includes(currentCountry)">
      Due to pandemic we are seeing significant international delays. We apologize for any inconvenience.
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import TextInput from '../BaseTextInput.vue'
import Address from '../BaseAddress.vue'
import Banner from '../BaseBanner.vue'
import Button from '../BaseButton.vue'
import Card from '../BaseCard.vue'
import CardContent from '../BaseCardContent.vue'
import Chip from '../BaseChip.vue'
import Instructions from '../BaseInstructions.vue'
import LoginForm from '../LoginForm.vue'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'

const cart = namespace('cart')
const user = namespace('user')

@Component({
  components: { TextInput, Address, Banner, Button, Card, CardContent, Chip, Instructions, LoginForm },
})
export default class ShippingInfo extends Vue {
  @cart.State((state: any) => state.shipping.address) address: Address
  @cart.State email: string
  @user.State isReturningCustomer: boolean
  @cart.State isVip: boolean
  @user.State loginEmailRequested: boolean
  @user.State username: string
  @user.State((state: any) => state.shipping.address) userShipping: Address
  @cart.State loginFormActive: boolean
  @user.State loginErrorMessage: string
  @cart.State useStoredShippingInfo: boolean
  @cart.Getter fullName: string

  @user.Getter loggedIn: string

  @cart.Mutation setEmail: any
  @cart.Mutation setAddress: any
  @cart.Mutation replaceShippingAddress: any
  @cart.Mutation toggleLoginForm: any
  @cart.Mutation clearLoginForm: any
  @cart.Mutation editStoredShippingAddress: any

  @user.Action logout: any
  @cart.Action checkUsername: (email: string) => Promise<void>
  @cart.Action updateCart: () => Promise<void>
  @cart.Action identifyTrack: ({ name, email }: {name?: string, email?: string}) => Promise<void>
  @cart.Action sendCheckoutStartEvent: () => Promise<void>

  welcomeBackCardDismissed: boolean = false

  updateAddress ($event: FormInputEvent) {
    this.setAddress({
      location: 'shipping',
      field: $event.name,
      value: $event.value,
    })

    if ($event.name === 'country' || $event.name === 'state') {
      this.updateCart()
    }
  }

  handleLogoutClicked (e: MouseEvent) {
    e.preventDefault()
    this.logout()
  }

  handleBlurEmail (name: string, email: string) {
    this.checkUsername(email)
    window.woopra && window.woopra.identify({ email })
    this.identifyTrack({ email })
  }

  handleBlur (name: string, value: string) {
    if (name === 'givenName' || name === 'familyName') {
      this.identifyTrack({ name: this.fullName })
      this.sendCheckoutStartEvent()
    }
  }

  get currentCountry () {
    if (this.useStoredShippingInfo && this.username && this.userShipping) {
      return this.userShipping.country
    }

    return this.address.country
  }
}
</script>

<style scoped>
section {
  position: relative;
  background: white;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

.welcome-back {
  margin-bottom: 1rem;
}

.login-prompt {
  margin: 0;
  text-align: right;
  padding: 0;
  font-size: .8em;
  cursor: pointer;
}

.login-prompt a {
  text-decoration: underline;
}

.login-prompt:hover a {
  text-decoration: none;
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

.shipping-delay-warning {
  background-color: #fee;
  color: #721c24;
  padding: 1rem;
  line-height: 1.6em;
}
</style>
