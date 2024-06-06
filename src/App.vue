<script setup lang="ts">
import LoadText from "./components/loadText.vue";
import ExportLoad from "./components/ExportLoad.vue";
import Search from "./components/Search.vue";
import LoadPDF from "./components/loadPDF.vue";
import { useMainStore } from "./stores/main";

const mainStore = useMainStore();
</script>

<template>
  <div v-if="!mainStore.loading">
    <ExportLoad />
    <Search />
    <LoadText />
    <LoadPDF />
  </div>
  <div v-else>
    <p>{{ mainStore.loading }}</p>
  </div>
</template>

<style scoped></style>
