<template>
  <div id="refer" v-if="loggedIn">
    <Heading>Refer Your Friends</Heading>
    <Card>
      <CardContent>
        <ReferPrompt :id="refId" />
      </CardContent>
    </Card>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { State, Getter, Action, namespace } from 'vuex-class'
import Card from '../components/BaseCard.vue'
import CardContent from '../components/BaseCardContent.vue'
import Heading from '../components/BaseHeading.vue'
import ReferPrompt from '../components/ReferPrompt.vue'

const user = namespace('user')

@Component({ components: { Card, CardContent, Heading, ReferPrompt } })
export default class Refer extends Vue {
  @user.Getter loggedIn: boolean
  @user.State refId: string
}
</script>
