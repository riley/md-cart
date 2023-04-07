<!-- this file is for the Thank You page -->
<template>
  <div class="customer-info-root">
    <div v-if="orderError">{{ orderError }}</div>
    <div v-else-if="fetching" class="order-fetching">
      <Spinner />
    </div>
    <div v-else-if="orderLoadedOnce">
      <div class="customer-summary">
        <div class="thank-you-callout">
          <div class="check-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
          </div>
          order {{ id }}<br>
        </div>
        <h3>Thank you {{ thankedPerson }}!</h3>
        <div v-if="shipping.country !== 'US'" class="shipping-delay-warning">
          We are currently experiencing higher than normal delays in customs due to the ongoing pandemic. Thank you for your patience and understanding.
        </div>
        <Card class="refer-prompt">
          <CardContent>
            <ReferPrompt :id="userRefId" />
          </CardContent>
        </Card>
        <Card class="status-card">
          <ShipStatus
            :createdAt="createdAt"
            :status="status"
            :address="shipping" />
        </Card>
        <Card class="update-card">
          <CardContent>
            <h2>Order Updates</h2>
            <p class="update-copy">You'll get shipping and delivery updates via email</p>
          </CardContent>
        </Card>
        <Card class="customer-info">
          <CardContent>
            <CustomerInfo
              :email="email"
              :shippingMethod="shippingMethod"
              :paymentMethod="paymentMethod"
              :shipping="shipping"
              :billing="billing"/>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Action, Mutation, namespace } from 'vuex-class'
import Button from './BaseButton.vue'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'
import CustomerInfo from './CustomerInfo.vue'
import ReferPrompt from './ReferPrompt.vue'
import ShipStatus from './ShipStatus.vue'
import Spinner from './BaseSpinner.vue'

const order = namespace('order')
const cart = namespace('cart')

@Component({
  components: { Button, Card, CardContent, CustomerInfo, ReferPrompt, ShipStatus, Spinner }
})
export default class OrderDetails extends Vue {
  @order.State orderError: string
  @order.State fetching: string
  @order.State orderLoadedOnce: boolean
  @order.State id: string
  @order.State createdAt: Date
  @order.State status: string
  @order.State(state => state.shipping.address) shipping: Address
  @order.State userRefId: string
  @order.State email: string
  @order.State(state => state.shipping.service) shippingMethod: string
  @order.State(state => state.billing.address) billing: Address
  @order.State paymentMethod: string

  get thankedPerson () {
    if (this.billing) {
      return `${this.billing.givenName.trim()} ${this.billing.familyName.trim()}`

    } else if (this.shipping) {
      return `${this.shipping.givenName.trim()} ${this.shipping.familyName.trim()}`

    } else {
      return 'friend'
    }
  }
}
</script>

<style scoped>
.customer-info-root {
  background: white;
  padding: 1rem;
}

h2 {
  margin-top: 0;
}

.thank-you-callout {
  display: flex;
  align-items: center;
}

.check-wrapper {
  border: 1px solid #1976d2;
  border-radius: 15px;
  display: inline-flex;
  width: 30px;
  height: 30px;
  justify-content: center;
  align-items: center;
  margin-right: .75rem;
}

.check-wrapper svg {
  fill: #1976d2;
}

.update-card, .status-card, .refer-prompt, .customer-info {
  margin-bottom: 1rem;
}

.update-copy {
  margin-bottom: 0;
}

.order-fetching {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.shipping-delay-warning {
  background-color: #fee;
  color: #721c24;
  padding: 1rem;
  line-height: 1.6em;
}
</style>
