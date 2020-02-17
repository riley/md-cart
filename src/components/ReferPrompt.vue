<template>
  <div>
    <p class="cta give">Give a little.</p>
    <div class="refer-callout-bubbles">
      <div class="callout left" :class="{on}">
        <div class="text-holder">
          <span class="earn">give</span>
          <br>
          <span class="dollaz">$10</span>
        </div>
      </div>
      <div class="callout right" :class="{on}">
        <div class="text-holder">
          <span class="earn">earn</span>
          <br>
          <span class="dollaz">$10</span>
        </div>
      </div>
    </div>
    <p class="cta get">Get a little.</p>
    <p>Share this link to get your friends $10 off their first purchase of $40 or more. You’ll earn $10 credit for each purchase too!</p>
    <div class="ref-link">
      <TextInput :value="referralLink" />
      <Button class="clipboard-cta" @click="copyToClipboard" :variant="copiedToClipboard ? 'success' : 'primary'">{{ copiedToClipboard ? 'Copied!' : 'Copy 📋' }}</Button>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from 'vue-property-decorator'
import Button from './BaseButton.vue'
import TextInput from './BaseTextInput.vue'

@Component({
  components: { TextInput, Button },
})
export default class ReferPrompt extends Vue {
  @Prop() id: string

  on = false
  copiedToClipboard = false

  mounted () {
    setTimeout(() => {
      this.on = true
    }, 0)
  }

  get referralLink () {
    return `https://mrdavis.com?ref=${this.id}`
  }

  copyToClipboard () {
    try {
      const el = document.createElement('textarea')
      el.value = this.referralLink
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      const selected = document.getSelection()!.rangeCount > 0 ? document.getSelection()!.getRangeAt(0)! : false
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      if (selected) {
        document.getSelection()!.removeAllRanges()
        document.getSelection()!.addRange(selected)
      }
      // tell the user we copied it
      this.copiedToClipboard = true
    } catch (e) {
      // nothing?
    }
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
  line-height: 1em;
}

.get {
  margin-top: 1rem;
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
  transition: all .5s 2s cubic-bezier(0.23, 1, 0.32, 1);
}

.text-holder {
  text-align: center;
  word-wrap: normal;
  width: 100%;
}

.earn {
  font-size: 2.5em;
}

.dollaz {
  margin-top: 15px;
  font-size: 4em;
  letter-spacing: -0.08em;
  transform: translateX(-4px);
  display: inline-block;
}

.left {
  opacity: 0;
  background: linear-gradient(to left top, #388ea8 0%, #0EAFE0 99%);
  transform: translateX(-100px);
}

.right {
  opacity: 0;
  background: linear-gradient(to right top, #DC871D 0%, #d35b46 99%);
  transform: translateX(100px);
}

.left.on {
  opacity: 1;
  transform: translateX(-70px);
}

.right.on {
  opacity: 1;
  transform: translateX(70px);
}

.clipboard-cta {
  max-width: 7rem;
}

.ref-link {
  display: flex;
}

.ref-link > :first-child {
  flex-grow: 1;
  margin-right: 1rem;
}
</style>
