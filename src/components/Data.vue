<script setup lang="ts">
import TextSnippet from "./TextSnippet.vue";

import { useMainStore } from "../stores/main";
import { ref, computed } from "vue";

const mainStore = useMainStore();
const limitedTo = ref(100);

const loadMore = () => {
  limitedTo.value += 100;
};

const db = computed(() => {
  return mainStore.db.slice(0, limitedTo.value);
});
</script>

<template>
  <div>
    <h1>Data</h1>
    <div class="data-entries" v-if="mainStore.db.length">
      <TextSnippet v-for="(item, index) in db" :key="index" :entry="item" />
      <button v-if="limitedTo < mainStore.db.length" @click="loadMore">
        Load more
      </button>
    </div>
    <p v-else>No data</p>
  </div>
</template>

<style scoped>
.data-entries {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
