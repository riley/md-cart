<template>
  <div class="banner" :class="{ [variant]: true }">
    <div class="copy">
      <p v-if="title" class="title">{{ title }}</p>
      <slot name="copy"></slot>
    </div>
    <div class="options" v-if="!!$slots.secondary || !!$slots.main">
      <BaseButton v-if="$slots.secondary" inline :variant="variant" @click="$emit('secondary')">
        <slot name="secondary"></slot>
      </BaseButton>
      <BaseButton v-if="!!$slots.main" inline :variant="variant" @click="$emit('main')">
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
    title: { type: String, default: null },
    variant: { type: String, default: null }
  },
  components: { BaseButton }
}
</script>

<style scoped>
.banner {
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
  border-radius: 4px;
  margin-bottom: 1.75rem;
}

.brand.banner {
  background: rgba(91, 121, 117, .1);
}

.title {
  color: rgba(0, 0, 0, .5);
  font-weight: 700;
  font-size: 1.5em;
  margin-top: 0;
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
