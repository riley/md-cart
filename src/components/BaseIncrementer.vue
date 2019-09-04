<template>
  <div class="incrementer_root">
    <button @click="decrement">-</button>
    <output>{{ value }}</output>
    <button @click="increment">+</button>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class BaseIncrementer extends Vue {
  @Prop({ default: 0 }) value!: number

  increment () {
    this.$emit('input', this.value + 1)
  }
  decrement () {
    this.$emit('input', this.value - 1)
  }
}
</script>

<style scoped>
.incrementer_root {
  display: flex;
  width: 6rem;
}

button {
  border: none;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 30px;
  background: none;
}

output {
  width: 2rem;
  height: 2rem;
  display: flex;
  font-size: 20px;
  align-items: center;
  justify-content: center;
  border: 1px solid grey;
}
</style>
