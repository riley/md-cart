<template>
  <div class="admin-root">
    <p class="login-prompt">
      <span v-if="!loggedIn">Returning?
        <Button inline @click="toggleLoginForm(true)">Login</Button>
      </span>
      <span v-else>Welcome back {{ username }}
        <Button inline @click="logout">Logout</Button>
      </span>
    </p>
    <ActionChooser />
    <Banner v-if="applicationError" title="Application Error" variant="warning">
      <template v-slot:copy>
        {{ applicationError }}
        <p>If the problem persists, please contact <a href="mailto:support@mrdavis.com">support@mrdavis.com</a></p>
      </template>
    </Banner>
    <router-view />
    <LoginForm
      v-if="loginFormActive"
      :email="username"
      :loginErrorMessage="loginErrorMessage"
      :loginEmailRequested="loginEmailRequested"
      :setEmail="setUsername"
      :clearLoginForm="clearLoginForm"
      @close="clearLoginForm" />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Action, Mutation, namespace } from 'vuex-class'
import ActionChooser from './ActionChooser.vue'
import Banner from '../components/BaseBanner.vue'
import Button from '../components/BaseButton.vue'
import LoginForm from '../components/LoginForm.vue'

const user = namespace('user')

@Component({ components: { ActionChooser, LoginForm, Banner, Button } })
export default class Admin extends Vue {
  @State loginFormActive: boolean
  @State applicationError: string
  @user.State loginEmailRequested: boolean
  @user.State loginErrorMessage: string
  @user.State username: string
  @user.State failedToFetchUser: boolean
  @user.State userLoginFailed: boolean | null

  @user.Getter loggedIn: boolean

  @Mutation setApplicationError: (message: string) => void
  @Mutation toggleLoginForm: any
  @Mutation clearLoginForm: any
  @user.Mutation setUsername: any

  @user.Action logout: () => Promise<void>
  @user.Action fetchUser: () => Promise<void>
  @Action fetchStock: () => Promise<void>
  @Action fetchVips: () => Promise<void>
  @Action fetchOrders: () => Promise<void>

  async mounted () {
    try {
      this.fetchStock()
      this.fetchUser()
      this.fetchVips()
      this.fetchOrders()
    } catch (e) {
      console.error(e)
      this.setApplicationError(e.message)
    }
  }
}
</script>
