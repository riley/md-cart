<template>
  <div>
    <Button>Login</Button>
    <div class="choices">
      <LoginForm v-if="loginFormActive" :loginErrorMessage="loginErrorMessage" :loginEmailRequested="loginEmailRequested" @close="clearLoginForm" />
      <ActionPanel v-for="panel of panels" :key="panel.icon" v-bind="panel" />
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Action, Mutation, namespace } from 'vuex-class'
import ActionPanel from './ActionPanel.vue'
import Button from './BaseButton.vue'
import LoginForm from './LoginForm.vue'

const user = namespace('user')

@Component({ components: { ActionPanel, LoginForm, Button } })
export default class ActionChooser extends Vue {
  @State loginFormActive: boolean
  @State loginEmailRequested: boolean
  @State loginErrorMessage: string
  @State panels: any[]
  @user.State loggedIn: boolean
  @user.Action fetchUser: () => Promise<void>
  @Mutation toggleLoginForm: any
  @Mutation clearLoginForm: any
  @Action fetchStock: () => Promise<void>
  @Action fetchVips: () => Promise<void>
  @Action fetchOrders: () => Promise<void>

  async mounted () {
    this.fetchStock()
    this.fetchUser()
    this.fetchVips()
    this.fetchOrders()
  }
}
</script>

<style scoped>
.choices {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-gap: 1rem;
}
</style>
