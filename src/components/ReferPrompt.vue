<template>
  <div>
    <p class="cta">Give a little.</p>
    <div class="refer-callout-bubbles">
      <div class="callout left" :class="{on}">
        <span class="earn">give</span><span class="dollaz">$10</span>
      </div>
      <div class="callout right" :class="{on}">
        <span class="earn">earn</span><span class="dollaz">$10</span>
      </div>
    </div>
    <p class="cta">Get a little.</p>
    <p>Share this link to get your friends $10 off their first purchase of $40 or more. You’ll earn $10 credit for each purchase too!</p>
    <TextInput :value="referralLink" />
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import TextInput from './BaseTextInput.vue'

@Component({
  components: { TextInput },
})
export default class ReferPrompt extends Vue {
  @Prop() id: string

  on = false

  mounted () {
    setTimeout(() => {
      this.on = true
    }, 0)
  }

  get referralLink () {
    return `https://mrdavis.com?ref=${this.id}`
  }
}
</script>

<style scoped>
.refer-callout-bubbles {
  position: relative;
  height: 180px;
  font-family: "Open Sans", sans-serif;
}

.cta {
  text-transform: uppercase;
  font-size: 3em;
  text-align: center;
  margin: 0;
}

.callout {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 160px;
  height: 160px;
  color: white;
  border-radius: 80px;
  flex-wrap: wrap;
  left: calc(50% - 80px);
  top: calc(50% - 80px);
  position: absolute;
  mix-blend-mode: multiply;
  transition: transform .5s 2s cubic-bezier(0.23, 1, 0.32, 1);
}

.earn {
  font-size: 2.5em;
  margin-bottom: -50px;
}

.dollaz {
  font-size: 4em;
  letter-spacing: -0.08em;
  transform: translateX(-4px);
}

.left {
  background: linear-gradient(to left top, #388ea8 0%, #0EAFE0 99%);
  transform: translateX(-100px);
}

.right {
  background: linear-gradient(to right top, #DC871D 0%, #d35b46 99%);
  transform: translateX(100px);
}

.left.on {
  transform: translateX(-70px);
}

.right.on {
  transform: translateX(70px);
}
</style>
