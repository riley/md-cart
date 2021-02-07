<template>
  <div class="admin-root">
    <ActionChooser />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Action, namespace } from 'vuex-class'
import ActionChooser from './ActionChooser.vue'

const user = namespace('user')

@Component({ components: { ActionChooser } })
export default class Admin extends Vue {
  @user.Action fetchUser: () => Promise<void>
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
