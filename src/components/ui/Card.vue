<script setup lang="ts"></script>

<template>
  <div class="card">
    <h2 v-if="$slots.title">
      <slot name="title"></slot>
    </h2>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.card {
  padding: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  margin: 0;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}
.card h2 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  color: #333;
  text-align: center;
}
</style>
