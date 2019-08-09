<template>
  <div>
    <span class="focussed ? 'red' : 'green'">{{ focussed }}</span>
    <vSelect
      @search:focus="setFocus"
      @search:blur="setBlur"
      @input="setSelected"
      :options="options" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import vSelect from 'vue-select'

@Component({
  components: { vSelect }
})
export default class Dropdown2 extends Vue {
  @Prop() options!: DropdownOption[]

  focussed = false
  selected = ''

  setFocus () {
    console.log('setFocus')
    this.focussed = true
  }

  setBlur () {
    console.log('set blur')
    this.focussed = false
  }

  setSelected (value: any) {
    console.log('setSelected', value)
  }
}
</script>

<style scoped>
.red {
  background-color: red;
}

.green {
  background-color: green;
}
</style>
