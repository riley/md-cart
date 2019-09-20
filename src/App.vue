<template>
  <Cart />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Cart from './components/Cart.vue'

@Component({
  components: {
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
</style>
