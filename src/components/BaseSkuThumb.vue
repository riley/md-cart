<template>
  <div class="thumbnail" :style="{'background-image': `url(https://mrdavis.com/img/icons/${icon}`, display: icon ? 'block' : 'none'}" />
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['icon']
})
</script>

<style scoped>
.thumbnail {
  width: 4rem;
  height: 4rem;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
}
</style>
