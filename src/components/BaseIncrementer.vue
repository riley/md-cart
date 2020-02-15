<template>
  <div class="incrementer_root">
    <!-- these should be buttons, but Safari doesn't apply display css to buttons -->
    <a class="increment" @click.prevent="decrement">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </a>
    <output>{{ value }}</output>
    <a class="decrement" @click.prevent="increment">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/><path d="M0 0h24v24H0z" fill="none"/></svg>
    </a>
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
  align-items: top;
  width: 6rem;
}

.increment, .decrement {
  border: none;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
  font-size: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: white;
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
