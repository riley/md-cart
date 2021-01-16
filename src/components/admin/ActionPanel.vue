<template>
  <div class="root" @click="scrollPage">
    <component v-bind:is="iconComponent" role="img" class="icon"></component>
    <p>{{ title }}</p>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import account from '../icons/account.vue'
import add from '../icons/add.vue'
import list from '../icons/list.vue'
import parcel from '../icons/parcel.vue'
import settings from '../icons/settings.vue'

@Component({ components: { account, add, list, parcel, settings } })
export default class ActionPanel extends Vue {
  @Prop() title!: string
  @Prop() path!: string
  @Prop() icon!: string

  icons: any = { account, add, list, parcel, settings }

  get iconComponent () {
    return this.icons[this.icon]
  }

  scrollPage () {
    this.$router.push({ path: this.path })
  }
}
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 200px;
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
  height: 70px;
  width: 70px;
  fill: rgba(0, 0, 0, .5);
  margin-bottom: 1rem;
  transition: transform .4s ease-out;
}

.root:hover .icon {
  transform: scale(1.3)
}

p {
  margin: 0;
  padding: 0;
}
</style>
