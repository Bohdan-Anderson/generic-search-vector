<template>
  <div class="cards">
    <slot></slot>
  </div>
</template>

<style scoped>
.cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20em, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}
</style>
