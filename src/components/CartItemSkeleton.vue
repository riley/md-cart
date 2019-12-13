<template>
  <div class="skeleton-root">
    <div class="skeleton-thumb" />
    <div class="skeleton-title" />
    <div class="skeleton-price" />
  </div>
</template>

<script lang="ts">
export default {}
</script>

<style scoped>
.skeleton-root {
  display: flex;
  padding: 1rem 1rem 1rem 0;
}

.skeleton-thumb {
  width: 4rem;
  height: 4rem;
  background-color: lightgrey;
  margin-right: 1rem;
}

/* https://codepen.io/oslego/pen/XdvWmd */

.skeleton-title {
  flex-grow: 1;
  height: 4rem;

  background-image:
    linear-gradient( 100deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.5) 50%, rgba(255, 255, 255, 0) 80% ),
    linear-gradient( lightgray 1rem, transparent 0 ),
    linear-gradient( lightgray 1rem, transparent 0 ),
    linear-gradient( lightgray 1rem, transparent 0 ),
    linear-gradient( lightgray 1rem, transparent 0 );

  background-repeat: repeat-y;

  background-size:
    50px 200px, /* highlight */
    150px 200px,
    350px 200px,
    300px 200px,
    250px 200px;

  background-position:
    0 0, /* highlight */
    0px 0,
    0px 2rem,
    0px 4rem,
    0px 6rem;

  animation: shine 1s infinite;
}

.skeleton-price {
  width: 5rem;
}

@keyframes shine {
  to {
    background-position:
      100% 0, /* move highlight to right */
      0px 0,
      0px 2rem,
      0px 4rem,
      0px 6rem;
  }
}
</style>
