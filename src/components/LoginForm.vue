<template>
  <div id="login-form" class="login-form">
    <div class="login-content">
      <p class="welcome-back">Welcome back</p>
      <p class="subhead">Enter your email address for an instant, secure, one-time code.</p>
      <form method="POST" @submit.prevent="handleClick">
        <BaseTextInput v-model="email" />
        <BaseButton @click="handleClick">Log In</BaseButton>
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
  @Action requestLoginEmail: any

  email = ''

  handleClick () {
    this.requestLoginEmail(this.email)
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
