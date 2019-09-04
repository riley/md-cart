<template>
  <div id="app">
    <Cart />
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cart from './components/Cart.vue'
import HelloWorld from './components/HelloWorld.vue'

@Component({
  components: {
    HelloWorld,
    Cart,
  }
})
export default class App extends Vue {}
</script>

<style>
:root {
  --main-color: rgba(210, 92, 74, .8);
  --main-color-fade: rgba(210, 92, 74, .2);
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
