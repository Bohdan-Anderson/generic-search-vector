<script setup lang="ts">
import { ref } from "vue";
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();
const text = ref("");

const clickLoad = () => {
  mainStore.loadText({ file: "firstFile.txt", text: text.value });
  text.value = "";
};
</script>

<template>
  <div>
    <h2>Load text</h2>
    <textarea v-model="text" placeholder="Add text here"></textarea>
    <button @click="clickLoad">Load</button>
  </div>
</template>

<style scoped></style>
