<template>
  <div class="admin-root">
    <ActionChooser />
    <router-view />
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import ActionChooser from './ActionChooser.vue'

export default {
  components: {
    ActionChooser,
  }
}
</script>
