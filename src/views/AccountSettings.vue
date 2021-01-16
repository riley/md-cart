<template>
  <div id="account-settings" v-if="loggedIn">
    <Heading>Account Settings</Heading>
    <Card class="personal-info">
      <div class="username">
        <div class="email">
          <p class="medium">Personal Information</p>
          <p v-if="!editingUsername">{{ username }}</p>
          <TextInput :value="username" v-else />
          <Button inline @click="editingUsername">{{ editingUsername ? 'Save' : 'Edit' }}</Button>
        </div>
      </div>
      <div class="payment">
        <p class="medium">Payment</p>
      </div>
      <div class="addresses">
        <p class="medium">Shipping & Billing Address</p>
        <div class="shipping">
          <p>Shipping</p>
          <Address
            @input="updateAddress($event, 'shipping')"
            :displayOnly="!editingShipping"
            v-bind="shippingAddress" />
          <Button inline @click="toggleEditShipping">{{ editingShipping ? 'Save' : 'Edit' }}</Button>
        </div>
        <div class="billing">
          <p>Billing</p>
          <Address
            @input="updateAddress($event, 'billing')"
            :displayOnly="!editingBilling"
            v-bind="billingAddress" />
          <Button inline @click="toggleEditBilling">{{ editingBilling ? 'Save' : 'Edit' }}</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'
import Card from '../components/BaseCard.vue'
import Button from '../components/BaseButton.vue'
import Address from '../components/BaseAddress.vue'
import TextInput from '../components/BaseTextInput.vue'

const user = namespace('user')

@Component({ components: { Address, Button, Card, Heading } })
export default class AccountSettings extends Vue {
  @user.State((state: any) => state.billing.address) billingAddress: Address
  @user.State((state: any) => state.shipping.address) shippingAddress: Address
  @user.State username: string
  @user.Getter loggedIn: boolean
  @user.Mutation setAddress: any

  editingShipping: boolean = false
  editingBilling: boolean = false
  editingUsername: boolean = false

  updateAddress ($event: FormInputEvent, location: string) {
    this.setAddress({
      location,
      field: $event.name,
      value: $event.value
    })
  }

  toggleEditShipping () {
    this.editingShipping = !this.editingShipping
  }

  toggleEditBilling () {
    this.editingBilling = !this.editingBilling
  }
}
</script>

<style scoped>
.personal-info {
  border: 1px solid #dcdcdc;
}

.personal-info > div {
  padding: 1rem;
}

.personal-info > div:not(:last-of-type) {
  border-bottom: 24px solid rgba(0, 0, 0, .03);
}

.medium {
  margin: 0 0 1rem;
  font-weight: bold;
}

.billing, .shipping {
  display: flex;
  justify-content: space-between;
}

.billing > div:nth-child(2), .shipping > div:nth-child(2) {
  flex-grow: 1;
}

.billing > p, .shipping > p {
  width: 25%;
}
</style>
