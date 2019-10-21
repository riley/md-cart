<template>
  <a v-if="href" :href="href" :style="{ float: position }" :class="{ inlineBlock: inline }" @click="handleClick">
    <slot></slot>
  </a>
  <button v-else :class="{ inlineBlock: inline, loading, disabled }" :style="{ float: position }" @click="handleClick">
    <span v-if="loading" class="spinner"></span>
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class BaseButton extends Vue {
  @Prop() href: string
  @Prop({ type: Boolean, default: false }) disabled: boolean
  @Prop({ type: Boolean }) inline: boolean;
  @Prop({ default: 'none' }) position: string;
  @Prop({ type: Boolean, default: false }) loading!: boolean;

  handleClick () {
    this.$emit('click')
  }
}
</script>

<style scoped>
button, a {
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
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.75rem 0.75rem 0.8125rem;
  color: rgb(255, 255, 255);
  background: rgba(210, 92, 74, .8);
  font-size: 1.25rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.0625rem 0px, rgba(0, 0, 5, 0.1) 0px 0.0625rem 0.125rem, rgba(0, 0, 0, 0.05) 0px 0.3125rem 0.9375rem;
  text-decoration: none;
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

button:hover,
button:focus,
a:hover,
a:focus {
  box-shadow: rgba(0, 0, 0, 0.05) 0px 0.3125rem 0.9375rem, rgba(0, 0, 0, 0.1) 0px 0.3125rem 0.3125rem, rgba(0, 0, 0, 0.05) 0px 0.125rem 0.3125rem;
  background: hsla(8,100%,70%,.99);
}

button.loading {
  padding-left: 40px;
}

.spinner {
  display: block;
  width: 1.5rem;
  height: 0;
  padding-bottom: 1.5rem;
  border-radius: 50%;
  top: .75rem;
  position: relative;
  transform: translate(-50%,-50%) rotate(0deg);
  will-change: transform;
  animation: spin 1600ms linear normal infinite;
  background-color: transparent;
  clip: rect(0, .75rem, .75rem,0);
}

.spinner::before, .spinner::after {
  content: ' ';
  height: 100%;
  width: 100%;
  border: 0.25rem solid rgba(255, 255, 255, .5);
  border-radius: 50%;
  clip: rect(0, .75rem, 1.5rem, 0);
  left: 0;
  position: absolute;
  top: 0;
  box-sizing: border-box;
  animation: shape-shift-before 1600ms linear normal infinite;
}

.spinner::after {
  animation: shape-shift-after 1600ms linear normal infinite;
}

.disabled {
  background: #ccc !important;
  color: #666 !important;
  border: 1px solid #aaa;
}

@keyframes spin {
  0% {
    transform: translate(-50%,-50%) rotate(0deg);
    clip: rect(0,4rem,8rem,0);
  }
  25% {
    transform: translate(-50%,-50%) rotate(90deg);
    clip: rect(0,4rem,8rem,0)
  }
  25.01% {
    transform: translate(-50%,-50%) rotate(90deg);
    clip: rect(auto,auto,auto,auto)
  }
  50% {
    transform: translate(-50%,-50%) rotate(180deg);
    clip: rect(auto,auto,auto,auto)
  }
  100%{
    transform: translate(-50%,-50%) rotate(730deg);
    clip: rect(0,4rem,8rem,0)
  }
}

@keyframes shape-shift-before {
  0% {
    transform: rotate(180deg)
  }
  25% {
    transform: rotate(360deg)
  }
  50% {
    transform: rotate(360deg)
  }
  75% {
    transform: rotate(360deg)
  }
  100% {
    transform: rotate(180deg)
  }
}
@keyframes shape-shift-after {
  0% {
    transform: rotate(180deg)
  }
  25% {
    transform: rotate(360deg)
  }
  50% {
    transform: rotate(540deg)
  }
  75% {
    transform: rotate(360deg)
  }
  100% {
    transform: rotate(180deg)
  }
}

button.inlineBlock:hover,
button.inlineBlock:focus,
a.inlineBlock:hover,
a.inlineBlock:focus {
  box-shadow: none;
  background: rgba(210, 92, 74, .2);
}
</style>
