<template>
  <div class="snackbar" :class="{ visible }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class BaseSnackbar extends Vue {
  visible: boolean = false

  updated () {
    if (this.visible) return
    this.visible = true
    setTimeout(() => {
      this.visible = false
    }, 1500)
  }
}
</script>

<style scoped>
.snackbar {
  visibility: hidden;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  right: auto;
  bottom: 1rem;
  transform: translateX(-50%);
  padding: 1rem;
  background-color: #28a745;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
}

.snackbar.visible {
  visibility: visible;
}
</style>
