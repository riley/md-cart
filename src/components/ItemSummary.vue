<template>
  <div>item summary</div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class ItemSummary extends Vue {
  @Prop() stock: Product[]
  @Prop() bundle: Bundle

  get skus () {
    return []
  }
}
</script>

<style scoped>

</style>
