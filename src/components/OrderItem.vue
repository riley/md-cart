<template>
  <div class="item-root">
    <div class="thumbnail" :style="{ 'background-image': `url(/img/icons/${icon})` }" />
    <div class="product-info">
      <p class="title">{{ title }}</p>
    </div>
    <div class="quantity">{{ quantity }}x</div>
  </div>
</template>

<script lang="ts">
export default {
  components: { },
  props: {
    description: String,
    quantity: Number,
    sku: String,
    title: String,
    icon: String
  },
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

.thumbnail {
  min-width: 100px;
  min-height: 100px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center center;
  border-radius: 4px;
}

.product-info {
  margin: 0 .5rem;
  flex-grow: 1;
}

.title {
  font-size: 17px;
  margin: 0;
  text-align: left;
}

.quantity {
  max-width: 50px;
  font-weight: bold;
  font-size: 1.5rem;
}

.description {
  color: #333;
  font-size: .8em;
  line-height: 1em;
  margin: 0;
}
</style>
