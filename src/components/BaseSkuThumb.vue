<template>
  <div class="thumbnail" :style="{'background-image': `url(/img/icons/${icon})`, display: icon ? 'block' : 'none'}" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  props: ['icon']
})
</script>

<style scoped>
.thumbnail {
  min-width: 5rem;
  min-height: 5rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
