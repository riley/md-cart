<template>
  <div class="container">
    <div class="spinner">
      <span class="spinner-inner"></span>
    </div>
  </div>
</template>

<script lang="ts">
export default { }
</script>

<style scoped>
.container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.spinner {
  width: 30px;
  height: 30px;
  position: relative;
  border: 4px solid currentColor;
  animation: loader 2s infinite ease;
}

.spinner-inner {
  vertical-align: top;
  display: inline-block;
  width: 100%;
  background-color: #ccc;
  animation: loader-inner 2s infinite ease-in;
}

@keyframes loader {
  0% { transform: rotate(0deg) }
  25% { transform: rotate(180deg) }
  50% { transform: rotate(180deg) }
  75% { transform: rotate(360deg) }
  100% { transform: rotate(360deg) }
}

@keyframes loader-inner {
  0% { height: 0% }
  25% { height: 0% }
  50% { height: 100% }
  75% { height: 100% }
  100% { height: 0% }
}
</style>
