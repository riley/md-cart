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
    <Snoozed
      v-if="snoozing"
      :fetching="fetchingSnooze"
      :snoozeError="snoozeError"
      @dismiss="setSnoozing(false)"
      v-bind="snoozedVIP" />
    <div class="choices">
      <LoginForm
        v-if="loginFormActive"
        :email="username"
        :loginErrorMessage="loginErrorMessage"
        :loginEmailRequested="loginEmailRequested"
        :setEmail="setUsername"
        :clearLoginForm="clearLoginForm"
        @close="clearLoginForm" />
      <ActionPanel v-for="panel of panels" :key="panel.icon" v-bind="panel" />
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
import Snoozed from '../components/admin/Snoozed.vue'

const user = namespace('user')

@Component({ components: { ActionPanel, LoginForm, Button, Overlay, Snoozed } })
export default class ActionChooser extends Vue {
  @State fetchingSnooze: boolean
  @State loginFormActive: boolean
  @State snoozeHash: string
  @State snoozing: boolean
  @State snoozeError: string
  @user.State loginEmailRequested: boolean
  @user.State loginErrorMessage: string
  @State panels: any[]
  @State snoozedVIP: VIP
  @user.State username: string
  @user.State(state => state.billingAddress.name) name: string
  @user.State failedToFetchUser: boolean

  @user.Getter loggedIn: boolean

  @Mutation toggleLoginForm: any
  @Mutation clearLoginForm: any
  @Mutation setSnoozing: (snoozing: boolean) => void
  @user.Mutation setUsername: any

  @user.Action logout: () => Promise<void>
  @user.Action fetchUser: () => Promise<void>
  @Action fetchStock: () => Promise<void>
  @Action fetchVips: () => Promise<void>
  @Action fetchOrders: () => Promise<void>
  @Action snoozeByHash: (id: string) => Promise<void>

  async mounted () {
    this.fetchStock()
    this.fetchUser()
    this.fetchVips()
    this.fetchOrders()

    if (this.snoozing) {
      this.snoozeByHash(this.snoozeHash)
    }
  }
}
</script>

<style scoped>
.choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  grid-gap: 1rem;
}
</style>
