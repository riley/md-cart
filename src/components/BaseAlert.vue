<template>
  <blockquote :class="{ [variant]: true, closeButton }">
    <slot></slot>
  </blockquote>
</template>

<script lang="ts">
import Vue from 'vue'
export default {
  props: { variant: String, closeButton: Boolean }
}
</script>

<style scoped>
blockquote {
  margin: 2rem 0;
  padding: 1rem 2rem;
  position: relative;
}

blockquote.closeButton {
  padding-right: 2rem;
}

blockquote.closeButton::after {
  content: '×';
  position: absolute;
  top: .5rem;
  right: 1rem;
  font-weight: bold;
  font-size: 1.5rem;
}

.primary {
  color: #004085;
  background-color: #cce5ff;
  border-left: 5px solid #b8daff;
}

.secondary {
  color: #383d41;
  background-color: #e2e3e5;
  border-left: 5px solid #d6d8db;
}

.success {
  color: #155724;
  background-color: #d4edda;
  border-left: 5px solid #c3e6cb;
}

.warning {
  color: #721c24;
  background-color: rgba(255,229,100,0.2);
  border-left: 5px solid #ffe564;
}

.danger {
  color: #721c24;
  background-color: #f8d7da;
  border-left: 5px solid #f5c6cb;
}

.info {
  color: #0c5460;
  background-color: #d1ecf1;
  border-left: 5px solid #bee5eb;
}
</style>
