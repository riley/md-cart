<template>
  <div>
    <LoginForm v-if="loginFormActive" :loginEmailRequested="loginEmailRequested" @close="hideLoginForm" />
    <div class="access-buttons">
      <Button v-if="!userLoggedIn" inline @click="showLoginForm">Login</Button>
      <Button v-else inline @click="logout">Logout</Button>
    </div>
    <ShippingInfo />
    <BillingInfo />
    <PaymentInfo />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { State, Getter, Mutation, namespace } from 'vuex-class'
import Button from './BaseButton.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import LoginForm from './LoginForm.vue'

const cart = namespace('cart')

@Component({
  components: { Button, ShippingInfo, BillingInfo, PaymentInfo, LoginForm },
})
export default class CustomerInfoInputs extends Vue {
  @cart.Getter userLoggedIn: boolean
  @cart.State loginEmailRequested: boolean
  @cart.Mutation logout: any

  loginFormActive: boolean = false

  showLoginForm () {
    this.loginFormActive = true
  }

  hideLoginForm () {
    this.loginFormActive = false
  }
}
</script>

<style scoped>
.access-buttons {
  text-align: right;
}
</style>
