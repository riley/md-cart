<template>
  <router-link :to="path" class="root">
    <component v-bind:is="iconComponent" role="img" class="icon"></component>
    <span class="title">{{ title }}</span>
  </router-link>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import account from '../icons/account.vue'
import add from '../icons/add.vue'
import list from '../icons/list.vue'
import parcel from '../icons/parcel.vue'
import settings from '../icons/settings.vue'
import share from '../icons/share.vue'

@Component({ components: { account, add, list, parcel, settings, share } })
export default class ActionPanel extends Vue {
  @Prop() title!: string
  @Prop() path!: string
  @Prop() icon!: string

  icons: any = { account, add, list, parcel, settings, share }

  get iconComponent () {
    return this.icons[this.icon]
  }
}
</script>

<style scoped>
.root {
  display: flex;
  flex-direction: column;
  height: 130px;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(133,178,188,0.39);
  background: rgba(0, 0, 0, .065);
  cursor: pointer;
  text-align: center;
  padding: 1rem;
  text-decoration: none;
  color: black;
  border-bottom: 5px solid #ddd;
  transition: all .3s;
}

.root.router-link-active {
  border-bottom-color: #d06b64;
}

.root:hover {
  border-bottom-color: #666;
}

.icon {
  height: 50px;
  width: 50px;
  fill: rgba(0, 0, 0, .5);
  margin-bottom: 1rem;
  transition: transform .4s ease-out;
}

@media (max-width: 50rem) {
  .root {
    padding: .5rem;
    height: 3rem;
    flex-direction: row;
    border-bottom-width: 2px;
  }

  .icon {
    width: 24px;
    height: 24px;
    margin-bottom: 0;
    margin-right: .5rem;
  }
}

.root:hover .icon {
  transform: scale(1.2)
}
</style>
