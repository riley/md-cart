<template>
  <div class="choices">

  </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator'
export default class ActionChooser extends Vue {
  actions = [
    {title: 'See Upcoming Order(s)'},
    {title: 'Make a New Order'},
    {title: 'Change Account Settings'},
    {title: 'See Past Order(s)'},
    {title: 'Change Vip Settings'}
    ]
}
</script>

<style scoped>
</style>
