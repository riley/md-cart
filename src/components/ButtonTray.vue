<template>
  <div class="actions">
    <slot></slot>
  </div>
</template>

<style scoped>
.actions {
  display: flex;
  justify-content: flex-end;
}

.actions button {
  margin-left: .5rem;
}
</style>
