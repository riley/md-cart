<template>
  <div class="badge-root">
    <slot></slot>
    <span class="badge">{{ count }}</span>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class Badge extends Vue {
  @Prop() count: number
}
</script>

<style scoped>
.badge-root {
  display: inline-flex;
  position: relative;
  flex-shrink: 0;
  vertical-align: middle;
}

.badge {
  top: 0;
  right: 0;
  background-color: #5b7975;
  color: white;
  transform: translate(50%, -50%);
  transform-origin: 100% 0%;
  height: 20px;
  display: flex;
  padding: 0 6px;
  position: absolute;
  flex-wrap: wrap;
  font-size: 0.75rem;
  min-width: 20px;
  box-sizing: border-box;
  align-items: center;
  line-height: 1;
  align-content: center;
  border-radius: 10px;
  flex-direction: row;
  justify-content: center;
}
</style>
