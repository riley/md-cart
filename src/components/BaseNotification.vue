<template>
  <p :class="[type]" class="root" role="alert" v-if="!hidden" @click="hide">
    <span v-html="message"></span>
    <span v-if="global" class="dismiss-button" aria-label="dismiss button">×</span>
  </p>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class BaseNotification extends Vue {
  @Prop() message: string
  @Prop({ type: Boolean, default: false }) global: boolean
  @Prop({ type: String, default: 'default' }) type: string

  hidden = false

  hide () {
    this.hidden = true
    this.$emit('close')
  }
}
</script>

<style scoped>
.root {
  padding: 0.75rem 1rem 0.75rem 1.25rem !important;
  margin: 0 0 1rem 0;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid white;
  cursor: pointer;
}

.dismiss-button {
  font-size: 2em;
  line-height: .5em;
  position: absolute;
  right: 1rem;
  top: 1rem;
}

.default {
  background-color: #eee;
  color: #383d41;
}

.error {
  background-color: #fee;
  color: #721c24;
}

.success {
  background-color: #C5E6A0;
  color: #33441f;
}

.primary {
  background-color: #594cfc;
  color: white;
}
</style>
