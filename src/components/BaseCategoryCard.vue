<template>
  <Card>
    <div class="type-image" :style="bkd" />
    <CardContent>
      {{ info.link }}
    </CardContent>
  </Card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Card from './BaseCard.vue'
import CardContent from './BaseCardContent.vue'

@Component({ components: { Card, CardContent } })
export default class BaseCategoryCard extends Vue {
  @Prop() info: Record<string, string>

  get bkd () {
    return `background-image: url(/img/icons/${this.info.type}.png)`
  }
}
</script>

<style scoped>
.type-image {
  height: 10rem;
  width: 100%;
  background-position: cover;
}
</style>
