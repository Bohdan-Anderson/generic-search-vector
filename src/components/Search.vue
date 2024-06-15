<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "../stores/main";
import Card from "./ui/Card.vue";
import CardWrapper from "./ui/CardWrapper.vue";

// import { summarizeText } from "../workers/summarize";

const mainStore = useMainStore();
const search = ref("");
const searching = ref<null | boolean>(null);
const summary = ref("");

const handleSearch = (e: any) => {
  e.preventDefault();
  summary.value = "";
  searching.value = true;
  mainStore.search(search.value).then(() => {
    searching.value = false;
  });
};
</script>

<template>
  <div>
    <h1>Search</h1>
    <form @submit="handleSearch">
      <input type="text" v-model="search" />
      <button @click="handleSearch">Search</button>
    </form>
    <p v-if="mainStore.summarized">
      {{ mainStore.summarized }}
    </p>
    <div v-if="searching">Searching...</div>
    <div v-if="searching === false && mainStore.results.length === 0">
      No results
    </div>
    <div v-if="summary">
      <p>{{ summary }}</p>
    </div>
    <CardWrapper>
      <Card
        v-for="(value, index) in mainStore.results.map((x) => x)"
        :key="index"
      >
        <!-- title slot -->
        <template #title>
          {{ Math.floor(value.score * 100) }}% <small>match</small>
        </template>
        <template #subtitle>{{ value.item.file }}</template>
        <template v-for="(text, index) in value.contextText">
          <b v-if="index === 1">
            {{ text }}
          </b>
          <template v-else>
            {{ text }}
          </template>
        </template>
      </Card>
    </CardWrapper>
  </div>
</template>
