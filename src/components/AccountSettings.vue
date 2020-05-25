<template>
  <div>
    <Heading>Account Settings</Heading>
    <Card class="personal-info">
      <div class="username">
        <p class="medium">Personal Information</p>
        <p>{{ username }}</p>
      </div>
      <div class="payment">
        <p class="medium">Payment</p>
      </div>
      <div class="addresses">
        <p class="medium">Shipping & Billing Address</p>
        <div class="shipping">
          <p>Shipping</p>
          <Address displayOnly v-bind="shippingAddress" />
          <Button inline>Edit</Button>
        </div>
        <div class="billing">
          <p>Billing</p>
          <Address displayOnly v-bind="billingAddress" />
          <Button inline>Edit</Button>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, namespace } from 'vuex-class'
import Heading from './BaseHeading.vue'
import Card from './BaseCard.vue'
import Button from './BaseButton.vue'
import Address from './BaseAddress.vue'

const user = namespace('user')

@Component({ components: { Address, Button, Card, Heading } })
export default class AccountSettings extends Vue {
  @user.State((state: any) => state.billing.address) billingAddress: Address
  @user.State((state: any) => state.shipping.address) shippingAddress: Address
  @user.State username: string
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
