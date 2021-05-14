<template>
  <div>
    <PayPal v-if="!isVip" />
    <p v-if="!isVip" class="or-regular">-- Or continue to pay with your credit card --</p>
    <ShippingInfo />
    <BillingInfo />
    <PaymentInfo />
    <div class="notification-container">
      <Notification v-if="isNonVIPCheckIn" global type="primary" message="Thanks for coming back! 🙌 your discount of $10 will be applied at checkout to orders more than $50." />
      <Notification v-if="globalErrorMessage" global type="error" :message="globalErrorMessage" @close="dismissNotification" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Mutation, namespace } from 'vuex-class'
import Button from '../BaseButton.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import PayPal from './PayPal.vue'
import Notification from '../BaseNotification.vue'

const cart = namespace('cart')

@Component({
  components: { Button, Notification, ShippingInfo, BillingInfo, PaymentInfo, PayPal },
})
export default class CustomerInfoInputs extends Vue {
  @cart.State paypalAvailable: boolean
  @cart.State globalErrorMessage: string
  @cart.State isNonVIPCheckIn: boolean
  @cart.State isVip: boolean
  @cart.State refId: string
  @cart.Mutation setGlobalError: any

  dismissNotification () {
    this.setGlobalError(null)
  }
}
</script>

<style scoped>
.notification-container {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
}

.notification-container p {
  margin-bottom: 0;
  z-index: 40;
}

.or-regular {
  text-align: center;
  padding-bottom: 1rem;
  font-weight: 700;
}
</style>
