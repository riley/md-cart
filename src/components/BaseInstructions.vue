<template>
  <h3>
    <span class="step">{{ step }}</span>
    <span class="text">{{ text }}</span>
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
  -moz-box-align: center;
  align-items: center;
  width: 100%;
  margin: 0px 0px 2rem !important;
  pointer-events: none;
}

.step {
  display: flex;
  margin-right: 1.25rem;
  -moz-box-align: center;
  align-items: center;
  -moz-box-pack: center;
  justify-content: center;
  width: 2rem;
  min-width: 2rem;
  height: 2rem;
  font-size: 1rem;
  line-height: 1.375;
  color: rgb(255, 255, 255);
  border-radius: 50%;
  background-color: #5C7975;
}

.text {
  text-align: left;
  font-family: 'Helvetica Neue', Helvetica, Arial, Helvetica, sans-serif;
  font-size: 2rem;
  line-height: 1.25;
  display: block;
}
</style>
