<template>
  <div class="root">
    <i class="icon" :class="{ [icon]: true }"></i>
    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'

@Component
export default class ActionPanel extends Vue {
  @Prop() title!: string
  @Prop() element!: string
  @Prop() icon!: string
}
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 320px;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(133,178,188,0.39);
  background: rgba(0, 0, 0, .03);
  cursor: pointer;
}

.root:hover, .root:focus, .root:active {
  background: rgba(91, 121, 117, .2);
}

.icon {
  font-size: 36px;
  line-height: 54px;
  height: 54px;
  width: 54px;
  background-color: rgba(0, 0, 0, .15);
  border-radius: 27px;
  margin-bottom: 1rem;
}

p {
  margin: 0;
  padding: 0;
}
</style>
