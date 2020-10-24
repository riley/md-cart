<template>
  <transition name="fade">
    <div v-if="active" class="holder">
      <div class="background" @click.self="$emit('dismiss')"></div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: { active: Boolean }
})
</script>

<style scoped>
.holder {
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  opacity: 1;
  z-index: 1000;
}

.background {
  background-color: rgba(33, 33, 33, .46);
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.content {
  position: relative;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .25s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
