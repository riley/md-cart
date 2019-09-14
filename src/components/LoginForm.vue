<template>
  <div id="login-form" class="login-form">
    <div class="login-content">
      <p class="welcome-back">Welcome back</p>
      <p class="subhead">Enter your email address for an instant, secure, one-time code.</p>
      <form method="POST" @submit.prevent="handleClick">
        <BaseTextInput v-model="email" />
        <template v-if="loginEmailRequested">
          <BaseButton inline @click="handleClick">Resend Email?</BaseButton>
          <p>Code sent ✔✅</p>
          <p>We’ve sent a one time code to your email. Enter it below to log in. For security each code you request expires after three hours.</p>
          <BaseTextInput label="6-digit code" v-model="magicCode" />
          <BaseButton @click="handleLoginButtonClick">Login</BaseButton>
        </template>
        <BaseButton v-else>Log In 🥙</BaseButton>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Action } from 'vuex-class'
import BaseTextInput from './BaseTextInput.vue'
import BaseButton from './BaseButton.vue'

@Component({
  components: { BaseTextInput, BaseButton },
})
export default class LoginForm extends Vue {
  @Prop({ type: Boolean }) loginEmailRequested: boolean
  @Action requestLoginEmail: any
  @Action login: any

  email = ''
  magicCode = ''

  handleClick () {
    if (this.email !== '') {
      this.requestLoginEmail(this.email)
    }
  }

  handleLoginButtonClick () {
    this.login({ email: this.email, code: this.magicCode })
  }
}
</script>

<style scoped>
.login-form {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  z-index: 100;
}

.login-content {
  max-width: 300px;
}

.welcome-back {
  text-align: center;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subhead {
  font-size: 14px;
}
</style>
