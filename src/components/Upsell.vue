<template>
  <Card>
    <div class="layout">
      <div class="thumb" :style="{'background-image': `url(${upsell.thumb})`}"/>
      <div class="info">
        <div><a class="title" :href="upsell.url" >{{ upsell.title }}</a></div>
        <p class="tagline">{{ upsell.tagline }}</p>
        <div class="cta">
          <span class="price">+ ${{ $baseSingle(upsell.clothingType) / 100 }}</span>
          <a :href="upsell.url" class="add-button" title="add to cart" @click="addToCart">+ Add</a>
        </div>
      </div>
    </div>
  </Card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Card from './BaseCard.vue'

@Component({ components: { Card } })
export default class Upsell extends Vue {
  @Prop() upsell: any

  addToCart () {

  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
}

.layout {
  display: flex;
}

.thumb {
  margin: .5rem;
  background-size: cover;
  background-position: center;
  width: 7rem;
  height: 7rem;
  background-color: white;
  flex-shrink: 0;
}

.info {
  padding: .5rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.title {
  display: inline-block;
  text-decoration: none;
  padding-bottom: 0.125rem;
  border-bottom: 0.0625rem solid rgba(33, 43, 100, 0.25);
  transition: all 0.2s ease 0s;
  margin-bottom: .5rem;
}

.title:hover {
  border-bottom: 0.0625rem solid rgb(30, 48, 110);
}

.tagline {
  flex-grow: 1;
  font-size: .8rem;
  margin: 0;
  color: rgb(82, 82, 82);
}

.cta {
  display: flex;
  justify-content: space-between;
}

.add-button {
  display: inline-block;
  color: rgb(109, 128, 180);
  padding: 0px 0.4375rem 0.0625rem;
  border: 0.09375rem solid rgb(109, 128, 180);
  border-radius: 0.75rem;
  background-color: rgb(255, 255, 255);
  cursor: pointer;
  font-size: .8rem;
  text-decoration: none;
}

.add-button:hover {
  color: rgb(30, 48, 110);
  background-color: rgb(235, 245, 251);
}

.price {
  font-size: .8rem;
}
</style>
