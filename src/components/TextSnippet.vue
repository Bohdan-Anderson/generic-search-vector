<script lang="ts" setup>
import type { Entry } from "../types";
defineProps<{
  entry: Entry;
}>();
</script>

<template>
  <div class="card">
    <h2 v-if="entry.file">{{ entry.file }}</h2>
    <p>{{ entry.text }}</p>
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
  gap: 10px;
}

.card h2,
.card p {
  margin: 0;
  font-size: 1em;
}
</style>
