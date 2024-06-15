<script setup lang="ts"></script>

<template>
  <div class="card">
    <div class="titles" v-if="$slots.title || $slots.subtitle">
      <h2 v-if="$slots.title">
        <slot name="title"></slot>
      </h2>
      <h3 v-if="$slots.subtitle">
        <slot name="subtitle"></slot>
      </h3>
    </div>

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
.card h2:deep small {
  display: none;
}
.titles {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}
</style>
