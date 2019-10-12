<template>
  <button :class="{ inlineBlock: inline }" :style="{ float: position }" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop({ type: Boolean }) inline: boolean;
  @Prop({ default: 'none' }) position: string;
  @Prop() loading!: boolean;

  handleClick () {
    this.$emit('click')
  }
}
</script>

<style scoped>
button {
  margin-top: 1em;
  font-style: normal;
  position: relative;
  line-height: 1.3;
  text-align: center;
  white-space: nowrap;
  border: medium none;
  border-radius: 0.375rem;
  cursor: pointer;
  -moz-user-select: none;
  transition: background-color 0.15s ease-out 0s, color .15s ease-out 0s;
  -moz-appearance: none;
  display: block;
  width: 100%;
  padding: 0.75rem 0.75rem 0.8125rem;
  color: rgb(255, 255, 255);
  background: rgba(210, 92, 74, .8);
  font-size: 1.25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0px, rgba(0, 0, 5, 0.1) 0px 0.0625rem 0.125rem, rgba(0, 0, 0, 0.05) 0px 0.3125rem 0.9375rem;
}

.inlineBlock {
  display: inline-block;
  width: auto;
  background: white;
  color: rgba(210, 92, 74, .8);
  box-shadow: none;
  padding: 4px 8px;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: .02rem;
}

button:hover, button:focus {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.3125rem 0.9375rem, rgba(0, 0, 0, 0.1) 0px 0.3125rem 0.3125rem, rgba(0, 0, 0, 0.05) 0px 0.125rem 0.3125rem;
  background: hsla(8,100%,70%,.99);
}

button.inlineBlock:hover, button.inlineBlock:focus {
  box-shadow: none;
  background: rgba(210, 92, 74, .2);
}
</style>
