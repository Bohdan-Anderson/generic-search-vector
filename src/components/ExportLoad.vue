<script setup lang="ts">
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();

const exportData = () => {
  const data = JSON.stringify(mainStore.db);
  const blob = new Blob([data], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.txt";
  a.click();
  URL.revokeObjectURL(url);
};

const loadData = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    const data = e.target?.result as string;
    mainStore.setDB(JSON.parse(data));
  };
  reader.readAsText(file);
};
</script>

<template>
  <div>
    <h2>Export/Load</h2>
    <p>Export your data to a text file or load data from a text file.</p>
    <label for="id_import">Load File:</label>
    <br />
    <input id="id_import" type="file" @change="loadData" />
    <br />
    <button @click="exportData">Save to file</button>
  </div>
</template>

<style scoped></style>
