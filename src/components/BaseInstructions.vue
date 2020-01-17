<template>
  <h3>
    <span class="text">{{ step }}. {{ text }}</span>
  </h3>
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
  position: relative;
  display: flex;
  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, sans-serif;
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

.text {
  text-align: left;
  font-family: 'Helvetica Neue', Helvetica, Arial, Helvetica, sans-serif;
  font-size: 1.5rem;
  line-height: 1.25;
  display: block;
  letter-spacing: 1px;
  font-weight: normal;
}
</style>
