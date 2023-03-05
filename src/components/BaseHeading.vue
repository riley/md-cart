<template>
  <h2><slot /></h2>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: { }
})
</script>

<style scoped>
h2 {
  font-size: 2rem;
}
