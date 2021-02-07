<template>
  <div id="action-chooser">
    <p class="login-prompt">
      <span v-if="!loggedIn">Returning?
        <Button inline @click="toggleLoginForm(true)">Login</Button>
      </span>
      <span v-else>Welcome back {{ username }}
        <Button inline @click="logout">Logout</Button>
      </span>
    </p>
    <div class="choices">
      <LoginForm
        v-if="loginFormActive"
        :email="username"
        :loginErrorMessage="loginErrorMessage"
        :loginEmailRequested="loginEmailRequested"
        :setEmail="setUsername"
        :clearLoginForm="clearLoginForm"
        @close="clearLoginForm" />
      <ActionPanel v-if="upcomingRebills.length > 0" title="See Upcoming Order" path="/upcoming-orders" icon="parcel" />
      <ActionPanel title="Make a New Order" path="/send-now" icon="add" />
      <ActionPanel title="Change Account Settings" path="/account-settings" icon="account" />
      <ActionPanel title="See Past Orders" path="/past-orders" icon="list" />
      <ActionPanel title="Change Vip Settings" path="/vip-settings" icon="settings" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Action, Mutation, Getter, namespace } from 'vuex-class'
import ActionPanel from '../components/admin/ActionPanel.vue'
import Button from '../components/BaseButton.vue'
import LoginForm from '../components/LoginForm.vue'
import Overlay from '../components/Overlay.vue'

const user = namespace('user')

@Component({ components: { ActionPanel, LoginForm, Button, Overlay } })
export default class ActionChooser extends Vue {
  @State loginFormActive: boolean
  @user.State loginEmailRequested: boolean
  @user.State loginErrorMessage: string
  @user.State username: string
  @user.State(state => state.billingAddress.name) name: string
  @user.State failedToFetchUser: boolean

  @user.Getter loggedIn: boolean
  @State vipMap: VipMap

  @Mutation toggleLoginForm: any
  @Mutation clearLoginForm: any
  @user.Mutation setUsername: any

  @user.Action logout: () => Promise<void>

  get upcomingRebills () {
    return Object.values(this.vipMap)
      .filter((vip: any) => vip.status === 'active')
  }
}
</script>

<style scoped>
.choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
  grid-gap: 1rem;
}
</style>
