<template>
  <h3 class="text">{{ step }}. {{ text }}</h3>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class Instructions extends Vue {
  @Prop() text!: string
  @Prop() step!: number
}
</script>

<style scoped>
h3 {
  font: normal normal normal 1.25rem 'Helvetica Neue', Helvetica, Arial, Helvetica, sans-serif !important;
  text-transform: uppercase;
  color: #303030;
  -moz-box-align: center;
  align-items: center;
  width: 100%;
  margin: 0px 0px 1.5rem !important;
  pointer-events: none;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: .5rem;
}
</style>
