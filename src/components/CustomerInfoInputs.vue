<template>
  <div>
    <ShippingInfo />
    <BillingInfo />
    <PaymentInfo />
    <div class="notification-container">
      <Notification v-if="refId" global type="primary" :message="referralMessage" />
      <Notification v-if="isNonVIPCheckIn" global type="primary" message="Thanks for coming back! 🙌 your discount of $10 will be applied at checkout on orders more than $50." />
      <Notification v-if="globalErrorMessage" global type="error" :message="globalErrorMessage" @close="dismissNotification" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Mutation, namespace } from 'vuex-class'
import Button from './BaseButton.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import Notification from './BaseNotification.vue'

const cart = namespace('cart')

@Component({
  components: { Button, Notification, ShippingInfo, BillingInfo, PaymentInfo },
})
export default class CustomerInfoInputs extends Vue {
  @cart.State globalErrorMessage: string
  @cart.State isNonVIPCheckIn: boolean
  @cart.State refId: string
  @cart.Mutation setGlobalError: any

  get referralMessage () {
    return `Referral discount of $10 applied upon checkout to orders $40 or more with a new account [${this.refId}]`
  }

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
</style>
