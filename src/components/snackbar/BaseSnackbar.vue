<template>
  <div class="snackbar" :class="{ active }">
    <slot></slot>
  </div>
</template>

<script lang="ts">
// https://vuematerial.io/components/snackbar
// https://github.com/vuematerial/vue-material/tree/dev/src/components/MdSnackbar
import { Vue, Prop, Watch, Component } from 'vue-property-decorator'
import { createSnackbar, destroySnackbar } from './SnackbarQueue'

@Component
export default class BaseSnackbar extends Vue {
  @Prop() active: boolean
  @Prop({ default: 1000 }) duration: number

  @Watch('active')
  async onActiveChanged (value: boolean, oldValue: boolean) {
    console.log('value', value, 'old', oldValue)
    if (value) {
      // create snackbar
      await createSnackbar(this.duration, this)
      this.$emit('opened')
    } else {
      // destroy snackbar
      await destroySnackbar()
      this.$emit('closed')
    }
  }
}
</script>

<style scoped>
.snackbar {
  visibility: hidden;
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  left: 50%;
  right: auto;
  bottom: 1rem;
  padding: 1rem;
  background-color: #323232;
  color: hsla(0,0%,100%,.7);
  box-shadow: 0px 1px 3px 0px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 2px 1px -1px rgba(0,0,0,0.12);
  transition: all .4s ease-out;
  opacity: 0;
  transform: translate(-50%, 20%);
}

.snackbar.active {
  visibility: visible;
  opacity: 1;
  transform: translate(-50%, 0);
}
</style>
