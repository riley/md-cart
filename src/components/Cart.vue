<template>
  <div class="container">
    <CartSummary />
    <div>
      <Button
        v-if="!userLoggedIn"
        inline
        position="right"
        @click="showLoginForm"
        @close="hideLoginForm">Login</Button>
      <ShippingInfo />
      <BillingInfo />
      <PaymentInfo />
    </div>
    <LoginForm v-if="loginFormActive" :loginEmailRequested="loginEmailRequested" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Action, State, Getter } from 'vuex-class'
import Button from './BaseButton.vue'
import CartSummary from './CartSummary.vue'
import ShippingInfo from './ShippingInfo.vue'
import BillingInfo from './BillingInfo.vue'
import PaymentInfo from './PaymentInfo.vue'
import LoginForm from './LoginForm.vue'

@Component({
  components: {
    ShippingInfo,
    BillingInfo,
    PaymentInfo,
    CartSummary,
    Button,
    LoginForm,
  },
})
export default class Cart extends Vue {
  @State stock: Product[]
  @State loginEmailRequested: boolean
  @Getter userLoggedIn: boolean
  @Action fetchStock: () => Promise<void>
  @Action fetchCart: () => Promise<void>

  loginFormActive: boolean = false

  async mounted () {
    await this.fetchStock()
    this.fetchCart()
  }

  showLoginForm () {
    this.loginFormActive = true
  }

  hideLoginForm () {
    this.loginFormActive = false
  }
}
</script>

<style>
.container {
  display: flex;
  max-width: 100rem;
  margin: 0 auto;
  align-items: center;
  justify-content: center;
}

.container > div {
  flex: 1;
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

.log-thing {
  display: flex;
  min-width: 400px;
  background: darkslateblue;
  color: white;
  position: fixed;
  bottom: 0;
  left: 0;
}
.log-thing > div {
  flex: 1;
}
</style>
