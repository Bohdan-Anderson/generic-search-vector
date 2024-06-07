<script setup lang="ts">
import { useMainStore } from "../stores/main";
import { gettext } from "../utils/getPDF";
import { ref } from "vue";

const loading = ref(false);

const mainStore = useMainStore();

const onFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (!target.files) return;
  const file = target?.files[0];
  if (!file) return;
  var fileReader = new FileReader();
  fileReader.onload = async (e) => {
    loading.value = true;
    const rawData = e.target?.result;
    if (!rawData) return;
    const data = new Uint8Array(rawData as ArrayBuffer);
    const text = await gettext(data);
    await Promise.all(
      text.map((t, index) =>
        mainStore.loadText({ file: `${file.name} - page ${index}`, text: t })
      )
    );
    loading.value = false;
  };
  fileReader.readAsArrayBuffer(file);
};
</script>
<template>
  <div>
    <h2>Upload PDF</h2>
    <template v-if="loading">
      <p>Loading...</p>
    </template>
    <template v-else>
      <input type="file" @change="onFileUpload" />
    </template>
  </div>
</template>
