<template>
  <div id="account-settings" v-if="loggedIn">
    <Heading>Billing & Shipping Settings</Heading>
    <p>Modify your shipping, billing or contact information below. Changes automatically save once you make them.</p>
    <Card class="personal-info">
      <div class="username" :class="{ processing: processingUsername }">
        <p class="medium">Personal Information</p>
        <div class="email">
          <p v-if="!editingUsername">{{ username }}</p>
          <TextInput
            v-else
            :value="username"
            @input="setUsername"
            label="Email Address"
            autocomplete="email"
            name="email"
            type="email" />
          <a v-if="!editingUsername" href="#" class="edit" @click="toggleEditUsername">Edit</a>
          <Button v-if="editingUsername" inline @click="handleSaveUsername">Save</Button>
          <Button v-if="editingUsername" inline @click="toggleEditUsername">Cancel</Button>
        </div>
        <div v-if="processingUsername" class="roadblock">
          <Spinner />
        </div>
        <Snackbar :active.sync="confirmedUsernameUpdate">Username updated!</Snackbar>
      </div>
      <div class="payment" :class="{ processing: processingPayment }">
        <p class="medium">Payment</p>
        <Alert v-if="paymentError" variant="warning">{{ paymentError }}</Alert>
        <div v-if="cardMeta.lastFour" class="cardMeta">
          <a v-if="!editingPayment" class="edit" href="#" @click="toggleEditPayment">Edit</a>
          <p v-if="!editingPayment">**** **** **** {{ cardMeta.lastFour }}<br />{{ cardMeta.expMonth }}/{{ cardMeta.expYear }}</p>
          <div v-if="cardMeta.lastFour" class="billing">
            <p>Billing</p>
            <Address
              @input="updateAddress($event, 'billing')"
              :editMode="editingPayment"
              v-bind="billingAddress" />
          </div>
          <StripeTokenUpdate
            v-if="editingPayment"
            class="stripeTokenUpdate"
            @cancel="toggleEditPayment"
            @error="handlePaymentError"
            @token="handleSavePayment" />
        </div>
        <div v-if="processingPayment" class="roadblock">
          <Spinner />
        </div>
        <Snackbar :active.sync="confirmedPaymentUpdate">Payment preference updated!</Snackbar>
      </div>
      <div class="addresses" :class="{ processing: processingShipping }">
        <p class="medium">Shipping Address</p>
        <Alert v-if="shippingError" variant="warning">{{ shippingError }}</Alert>
        <div class="shipping">
          <p>Shipping</p>
          <Address
            @input="updateAddress($event, 'shipping')"
            :editMode="editingShipping"
            v-bind="shippingAddress" />
          <a v-if="!editingShipping" href="#" class="edit" @click="toggleEditShipping">Edit</a>
        </div>
        <ButtonTray  v-if="editingShipping">
          <Button inline @click="toggleEditShipping">Cancel</Button>
          <Button inline variant="primary" @click="handleSaveShipping">Save</Button>
        </ButtonTray>
        <div v-if="processingShipping" class="roadblock">
          <Spinner />
        </div>
        <Snackbar :active.sync="confirmedShippingUpdate">Shipping preference updated!</Snackbar>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Mutation, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Card from '../components/BaseCard.vue'
import Button from '../components/BaseButton.vue'
import Address from '../components/BaseAddress.vue'
import TextInput from '../components/BaseTextInput.vue'
import StripeTokenUpdate from '../components/admin/StripeTokenUpdate.vue'
import ButtonTray from '../components/ButtonTray.vue'
import Spinner from '../components/BaseSpinner.vue'
import Alert from '../components/BaseAlert.vue'
import ReferPrompt from '../components/ReferPrompt.vue'
import Snackbar from '../components/snackbar/BaseSnackbar.vue'

const user = namespace('user')

@Component({ components: { Address, Alert, Button, ButtonTray, Card, Heading, ReferPrompt, Snackbar, Spinner, StripeTokenUpdate, TextInput } })
export default class AccountSettings extends Vue {
  @State paymentError: string
  @State shippingError: string
  @user.State((state: any) => state.billing.address) billingAddress: Address
  @user.State((state: any) => state.shipping.address) shippingAddress: Address
  @user.State username: string
  @user.State cardMeta: any
  @user.State refId: string
  @user.Getter loggedIn: boolean
  @Mutation setPaymentError: (error: string | null) => void
  @Mutation setShippingUpdateError: (error: string | null) => void
  @Mutation setUsernameError: (error: string | null) => void
  @user.Mutation setAddress: any
  @user.Mutation setStripeToken: any
  @user.Mutation setUsername: (username: string) => void
  @user.Action update: () => Promise<void>

  editingShipping: boolean = false
  editingUsername: boolean = false
  editingPayment: boolean = false
  processingUsername: boolean = false
  processingPayment: boolean = false
  processingShipping: boolean = false
  confirmedUsernameUpdate: boolean = false
  confirmedPaymentUpdate: boolean = false
  confirmedShippingUpdate: boolean = false

  mounted () {
    this.confirmedUsernameUpdate = false
    this.confirmedPaymentUpdate = false
    this.confirmedShippingUpdate = false
  }

  updateAddress ($event: FormInputEvent, location: string) {
    this.setAddress({
      location,
      field: $event.name,
      value: $event.value
    })
  }

  async handleSaveUsername () {
    this.setUsernameError(null)
    this.editingUsername = false

    try {
      this.processingUsername = true
      await this.update()
      this.confirmedUsernameUpdate = true

      setTimeout(() => { this.confirmedUsernameUpdate = false }, 2000)
    } catch (e) {
      if (e instanceof Error) this.setUsernameError(e.message)
    }

    this.processingUsername = false
  }

  handlePaymentError (error: string) {
    this.setPaymentError(error)
  }

  async handleSavePayment (token: string) {
    this.setPaymentError(null)
    this.setStripeToken(token)
    this.editingPayment = false

    try {
      this.processingPayment = true
      await this.update()
      this.confirmedPaymentUpdate = true

      setTimeout(() => { this.confirmedPaymentUpdate = false }, 2000)
    } catch (e) {
      if (e instanceof Error) this.setPaymentError(e.message)
    }
    this.processingPayment = false
  }

  async handleSaveShipping () {
    this.setShippingUpdateError(null)
    this.editingShipping = false

    try {
      this.processingShipping = true
      await this.update()
      this.confirmedShippingUpdate = true

      setTimeout(() => { this.confirmedShippingUpdate = false }, 2000)
    } catch (e) {
      if (e instanceof Error) this.setShippingUpdateError(e.message)
    }

    this.processingShipping = false
  }

  toggleEditShipping (e?: MouseEvent) {
    e?.preventDefault()
    this.editingShipping = !this.editingShipping
    this.setShippingUpdateError(null)
  }

  toggleEditUsername (e?: MouseEvent) {
    e?.preventDefault()
    this.editingUsername = !this.editingUsername
  }

  toggleEditPayment (e?: MouseEvent) {
    e?.preventDefault()
    this.editingPayment = !this.editingPayment
    this.setPaymentError(null)
  }
}
</script>

<style scoped>
.panel {
  display: flex;
}

.personal-info {
  border: 1px solid #dcdcdc;
}

.personal-info > div {
  padding: 1rem;
}

.personal-info > div:not(:last-of-type) {
  border-bottom: 24px solid rgba(0, 0, 0, .065);
}

.medium {
  margin: 0 0 1rem;
  font-weight: bold;
}

.edit, .billing, .shipping {
  display: flex;
  justify-content: space-between;
}

.billing > div:nth-child(2), .shipping > div:nth-child(2) {
  flex-grow: 1;
}

.billing > p, .shipping > p {
  width: 25%;
}

.username, .payment, .addresses {
  position: relative;
}

.payment .edit {
  float: right;
}

.edit {
  text-decoration: none;
  font-weight: bold;
  color: black;
  transition: color .4s;
}

.edit:hover {
  color: hsla(8,100%,70%,.99);
}

.stripeTokenUpdate {
  margin-left: 25%;
}

.processing .cardMeta,
.processing .stripeTokenUpdate,
.processing .shipping,
.processing .email {
  filter: blur(4px);
}

.processing .roadblock {
  background-color: rgba(0, 0, 0, .2);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

@media (max-width: 50rem) {
  .billing, .shipping {
    flex-direction: column;
  }

  .panel {
    flex-direction: column;
  }

  .email, .refer-prompt {
    width: auto;
  }
}
</style>
