<template>
  <div class="admin-root">
    <div class="login-prompt">
      <span v-if="!loggedIn">Returning?
        <Button inline @click="toggleLoginForm(true)">Login</Button>
      </span>
      <span v-else>Welcome back {{ username }}
        <span v-if="credit > 0"><br />You have ${{ credit / 100 }} in Mr. Davis rewards!</span>
        <span v-else><br />Mr. Davis Rewards $0 - Refer friends to earn rewards! <a href="#" @click="goRefer">Learn more →</a></span>
        <Button inline @click="logout">Logout</Button>
      </span>
      <router-link v-if="!atHome && loggedIn" to="/">←&nbsp;Home</router-link>
    </div>
    <ActionChooser v-if="loggedIn" />
    <Banner v-if="applicationError" title="Application Error" variant="warning">
      <template v-slot:copy>
        {{ applicationError }}
        <p>If the problem persists, please contact <a href="mailto:support@mrdavis.com">support@mrdavis.com</a></p>
      </template>
    </Banner>
    <router-view />
    <LoginForm
      :style="{ display: loginFormActive ? 'flex' : 'none' }"
      :email="username"
      :loginErrorMessage="loginErrorMessage"
      :loginEmailRequested="loginEmailRequested"
      :setEmail="setUsername"
      :clearLoginForm="clearLoginForm"
      @loginSuccess="onLoginSuccess"
      @close="clearLoginForm"
    />
  </div>
</template>

<script lang="ts">
import { Vue, Watch, Component } from 'vue-property-decorator'
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
  @user.State credit: number
  @user.State loginEmailRequested: boolean
  @user.State loginErrorMessage: string
  @user.State username: string
  @user.State failedToFetchUser: boolean
  @user.State userLoginFailed: boolean | null

  @Getter allVips: VIP[]
  @user.Getter loggedIn: boolean

  @Mutation setApplicationError: (message: string) => void
  @Mutation toggleLoginForm: any
  @Mutation clearLoginForm: any
  @user.Mutation setUsername: any

  @user.Action logout: () => Promise<void>
  @user.Action fetchUser: () => Promise<boolean>
  @Action fetchStock: () => Promise<void>
  @Action fetchVips: () => Promise<void>
  @Action fetchOrders: () => Promise<void>

  async created () {
    this.fetchStock()

    const user = await this.fetchUser()
    if (user) {
      Promise.all([
        this.fetchVips(),
        this.fetchOrders()
      ])
    }
  }

  async fetchEverything () {
    console.log('fetchEverything')
    try {
      return Promise.all([
        this.fetchUser(),
        this.fetchVips(),
        this.fetchOrders()
      ])
    } catch (e) {
      console.error(e)
      if (e instanceof Error) {
        this.setApplicationError(e.message)
      }
    }
  }

  async onLoginSuccess () {
    await this.fetchEverything()

    if (this.allVips.length > 0) {
      this.$router.push({ name: 'vipList' })
    }
  }

  goRefer (e: Event) {
    e.preventDefault()
    this.$router.push({ name: 'refer' })
  }

  get atHome () {
    return this.$route.name === 'home'
  }
}
</script>

<style scoped>
.admin-root {
  min-height: 100vw;
}

.login-prompt {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}
</style>
