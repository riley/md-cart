<template>
  <div id="login-form" class="login-form" @click.self="emitClose">
    <div class="login-content">
      <p class="welcome-back">Welcome back</p>
      <p class="subhead">Enter your email address for an instant, secure, one-time code.</p>
      <form method="POST" @submit.prevent="onSubmit">
        <TextInput v-model="email" type="email" />
        <template v-if="loginEmailRequested">
          <p class="code-sent">
            <Button inline @click="handleClick">Resend Email?</Button>
            <span>Code sent ✅</span>
          </p>
          <p>We’ve sent a one time code to your email. Enter it below to log in. For security each code you request expires after three hours.</p>
          <TextInput label="6-digit code" v-model="magicCode" />
          <Notification v-if="loginErrorMessage" type="error" :message="loginErrorMessage" />
          <Button @click="handleLoginButtonClick">Login</Button>
        </template>
        <Button @click="handleClick" v-if="!loginEmailRequested">Log In</Button>
      </form>
    </div>
    <span class="close-button" @click="emitClose">×</span>
  </div>
</template>

<script lang="ts">
import { Prop, Component, Vue } from 'vue-property-decorator'
import { Action, namespace } from 'vuex-class'
import TextInput from './BaseTextInput.vue'
import Notification from './BaseNotification.vue'
import Button from './BaseButton.vue'

const cart = namespace('cart')

@Component({
  components: { TextInput, Button, Notification },
})
export default class LoginForm extends Vue {
  @Prop({ type: Boolean }) loginEmailRequested: boolean
  @Prop() loginErrorMessage: string
  @cart.Action requestLoginEmail: any
  @cart.Action login: any
  @cart.Mutation clearLoginForm: any

  email = ''
  magicCode = ''

  onSubmit () {
    console.log('onSubmit')
  }

  handleClick () {
    console.log('LoginForm handleClick')
    if (this.email !== '') {
      this.requestLoginEmail(this.email)
    }
  }

  handleLoginButtonClick () {
    this.login({ username: this.email, magicCode: this.magicCode })
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

.code-sent {
  display: flex;
  justify-content: space-between;
}

.subhead {
  font-size: 14px;
}

.close-button {
  position: absolute;
  top: 100px;
  right: 20px;
  font-size: 100px;
  cursor: pointer;
}
</style>
