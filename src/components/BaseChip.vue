<template>
  <span>
    <slot></slot>
  </span>
</template>

<script lang="ts">
export default {

}
</script>

<style scoped>
span {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  user-select: none;
  padding-left: 12px;
  padding-right: 12px;
  border: 1px solid rgba(0, 0, 0, .23);
  border-radius: 16px;
  height: 32px;
}
</style>
