<template>
  <div id="send-now" v-if="loggedIn">
    <Heading>Place an Order</Heading>
    <p>something happens here</p>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Getter, namespace } from 'vuex-class'
import Heading from '../components/BaseHeading.vue'

const user = namespace('user')

@Component({ components: { Heading } })
export default class OneTimeOrder extends Vue {
  @user.Getter loggedIn: boolean
}
</script>
