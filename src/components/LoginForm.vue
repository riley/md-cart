<template>
  <div id="login-form" class="login-form" @click.self="emitClose">
    <div class="login-content">
      <p class="welcome-back">Welcome back</p>
      <p class="subhead">Enter your email address for an instant, secure, one-time code.</p>
      <form method="POST" @submit.prevent="onSubmit">
        <TextInput :value="email" @input="handleEmail" type="email" autocomplete="email" @change="handleEmail" />
        <template v-if="loginEmailRequested">
          <p class="code-sent">
            <!-- this button sends the magic code email again -->
            <Button inline type="button" @click="requestCode">Resend Email?</Button>
            <span>Code sent ✅</span>
          </p>
          <p>If we have a user with that email address we sent the code there. Enter it below to log in. For security each code you request expires after three hours.</p>
          <TextInput :numpad="true" label="6-digit code" type="tel" :onEnterKey="attemptLogin" v-model="magicCode" />
          <Notification v-if="loginErrorMessage" type="error" :message="loginErrorMessage" />
          <!-- this button attmpts the login -->
          <Button class="login-button" @click="attemptLogin" type="button">Login</Button>
        </template>
        <!-- this button triggers the magic code request -->
        <Button class="login-button" @click="requestCode" type="button" v-if="!loginEmailRequested">Tap to Log In</Button>
        <p class="code-warning">If you don't receive an email within a minute, please let us know at <a href="mailto:support@mrdavis.com?subject=Missing login email">support@mrdavis.com</a> or just check out using your email address and we’ll link the order to your account.</p>
      </form>
      <span class="close-button" @click="emitClose">×</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Action, namespace } from 'vuex-class'
import TextInput from './BaseTextInput.vue'
import Notification from './BaseNotification.vue'
import Button from './BaseButton.vue'

const user = namespace('user')

@Component({
  components: { TextInput, Button, Notification },
})
export default class LoginForm extends Vue {
  @Prop({ type: Boolean }) loginEmailRequested: boolean
  @Prop() loginErrorMessage: string
  @Prop() email: string
  @Prop() clearLoginForm: Function
  @Prop() setEmail: Function
  @user.Action requestLoginEmail: Function
  @user.Action login: Function

  magicCode = ''

  onSubmit () {
    if (this.email !== '') {
      this.requestLoginEmail(this.email.trim())
    }
  }

  requestCode () {
    console.log('requestCode to log in')
    if (this.email !== '') {
      this.requestLoginEmail(this.email.trim())
    }
  }

  attemptLogin () {
    console.log('attemptLogin')
    this.login({ username: this.email.trim(), magicCode: this.magicCode })
  }

  handleEmail (username: string) {
    this.setEmail(username)
  }

  emitClose () {
    this.clearLoginForm()
    this.$emit('close')
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
  background: #efefef;
  z-index: 100;
}

.login-content {
  max-width: 300px;
  background-color: white;
  padding: 1rem;
  position: relative;
}

.welcome-back {
  text-align: center;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, sans-serif;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.code-sent {
  display: flex;
  justify-content: space-between;
}

.subhead {
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 50px;
  cursor: pointer;
}

.login-button {
  margin-bottom: .75rem;
}

.code-warning {
  margin: 0;
  padding: 0;
  color: #aaa;
  font-size: .75rem;
  line-height: 1rem;
}
</style>
