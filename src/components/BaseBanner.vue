<template>
  <div class="banner">
    <div class="copy">
      <p class="title" :style="{display: title ? 'block' : 'none'}">{{ title }}</p>
      <slot name="copy"></slot>
    </div>
    <div class="options">
      <BaseButton inline @click="$emit('secondary')">
        <slot name="secondary"></slot>
      </BaseButton>
      <BaseButton inline @click="$emit('main')">
        <slot name="main"></slot>
      </BaseButton>
    </div>
  </div>
</template>

<script>
// https://material.io/components/banners/#usage
import BaseButton from './BaseButton.vue'
export default {
  props: {
    title: { type: String, default: null }
  },
  components: { BaseButton }
}
</script>

<style scoped>
.banner {
  background: white;
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
  border-radius: 4px;
  margin-bottom: 1.75rem;
}

.title {
  color: rgba(0, 0, 0, .5);
}

.copy {
  padding: 16px;
  text-align: left;
}

.options {
  text-align: right;
  padding: 1rem;
}

.success {
  background-color: lightgreen;
}

.info {
  background-color: lightblue;
}

.warning {
  background-color: lightsalmon;
}
</style>
