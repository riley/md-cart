<template>
  <div class="item-root">
    <Badge class="item-thumb-container" :count="quantity">
      <div class="item-thumb" :style="{ 'background-image': `url(${imageURLs[0]})` }" />
    </Badge>
    <div class="meta">
      <p class="title">{{ title }}</p>
    </div>
    <div class="item-cost">
      ${{ cost / 100 }}
    </div>
  </div>
</template>

<script lang="ts">
import Badge from './BaseBadge.vue'

export default {
  components: { Badge },
  props: {
    cost: Number,
    description: String,
    quantity: Number,
    sku: String,
    title: String,
    imageURLs: Array
  }
}
</script>

<style scoped>
.item-root {
  position: relative;
  display: flex;
  border-bottom: 1px solid #ccc;
  padding: 1rem 0;
  width: 100%;
}

.item-root:first-child {
  padding-top: 0;
}

.item-root:last-child {
  padding-bottom: 0;
}

.item-thumb-container {
  width: 100px;
  margin-right: .5rem;
}

.item-thumb {
  width: 100px;
  height: 100px;
  background-size: cover;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.meta {
  margin: 0 .5rem;
  flex-grow: 1;
}

.title {
  font-weight: bold;
  margin: .5rem 0 10px 0;
}

.description {
  color: #333;
  font-size: .8em;
  line-height: 1em;
  margin: 0;
}

.item-cost {
  width: 100px;
  padding: .5rem;
  font-weight: bold;
  font-family: Oswald, sans-serif;
  font-size: 40px;
  text-align: right;
}
</style>
