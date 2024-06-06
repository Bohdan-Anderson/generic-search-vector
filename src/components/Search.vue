<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "../stores/main";
import Card from "./ui/Card.vue";
import CardWrapper from "./ui/CardWrapper.vue";

const mainStore = useMainStore();
const search = ref("");

const handleSearch = () => {
  mainStore.search(search.value);
};
</script>

<template>
  <div>
    <h1>Search</h1>
    <input type="text" v-model="search" />
    <button @click="handleSearch">Search</button>
    <CardWrapper>
      <Card
        v-for="(value, index) in mainStore.results.map((x) => x)"
        :key="index"
      >
        <!-- title slot -->
        <template #title> {{ Math.floor(value.score * 100) }}% </template>
        {{ value.item.text }}
      </Card>
    </CardWrapper>
  </div>
</template>
