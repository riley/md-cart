<template>
  <label :for="name">
    <input @input="handleInput" type="checkbox" :name="name" />
    <span class="checkbox-custom"></span>
    {{ label }}
  </label>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class BaseCheckbox extends Vue {
  @Prop() name!: string
  @Prop() label!: string

  handleInput ($event: any) {
    this.$emit('input', $event.target.checked)
  }
}
</script>

<style scoped>
label {
  text-align: left;
  padding-top: 5px;
  padding-left: 40px;
  display: block;
  position: relative;
  margin: auto;
  cursor: pointer;
  clear: both;
}

label input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

label .checkbox-custom {
  position: absolute;
  top: 0px;
  left: 0px;
  height: 24px;
  width: 24px;
  background-color: transparent;
  border-radius: 5px;
  transition: all 0.3s ease-out;
  border: 2px solid purple;
}

label input:checked ~ .checkbox-custom {
  background-color: purple;
  border-radius: 5px;
  transform: rotate(0deg) scale(1);
  opacity:1;
  border: 2px solid purple;
}

label .checkbox-custom::after {
  position: absolute;
  content: "";
  left: 12px;
  top: 12px;
  height: 0px;
  width: 0px;
  border-radius: 5px;
  border: solid #ffffff;
  border-width: 0 3px 3px 0;
  transform: rotate(0deg) scale(0);
  opacity:1;
  transition: all 0.3s ease-out;
}

label input:checked ~ .checkbox-custom::after {
  transform: rotate(45deg) scale(1);
  opacity:1;
  left: 8px;
  top: 3px;
  width: 6px;
  height: 12px;
  border: solid #ffffff;
  border-width: 0 2px 2px 0;
  background-color: transparent;
  border-radius: 0;
}

/* For Ripple Effect */
label .checkbox-custom::before {
  position: absolute;
  content: "";
  left: 10px;
  top: 10px;
  width: 0px;
  height: 0px;
  border-radius: 5px;
  border: 2px solid purple;
  transform: scale(0);
}

label input:checked ~ .checkbox-custom::before {
  left: -3px;
  top: -3px;
  width: 24px;
  height: 24px;
  border-radius: 5px;
  transform: scale(3);
  opacity:0;
  z-index: 999;
  transition: all 0.3s ease-out;
}

</style>
