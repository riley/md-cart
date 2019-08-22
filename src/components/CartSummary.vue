<template>
  <div>
    Cart Summary
    <Chooser />
    total: ${{ total }}
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Chooser from './Chooser.vue'

@Component({
  components: { Chooser },
  computed: {
    total () {
      return this.$store.getters.total / 100
    }
  }
})
export default class CartSummary extends Vue {

}
</script>
