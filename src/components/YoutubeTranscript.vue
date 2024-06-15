<script setup lang="ts">
import { useMainStore } from "../stores/main";
import { ref } from "vue";

type Line = {
  start: number;
  duration: number;
  text: string;
};

const loading = ref(false);

const mainStore = useMainStore();

const onFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const firstFile = target?.files[0];
  if (!firstFile) return;
  // for each file in files
  Array.from(target.files).forEach(async (file) => {
    const text = await file.text();
    const data = (JSON.parse(text) as Line[])
      .map((line) => line.text)
      .join(" ");
    mainStore.loadText({
      text: data,
      file: file.name,
    });
  });
};
</script>
<template>
  <div>
    <h2>Youtube Transcripts</h2>
    <template v-if="loading">
      <p>Loading...</p>
    </template>
    <template v-else>
      <input type="file" @change="onFileUpload" multiple />
    </template>
  </div>
</template>
