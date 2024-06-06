<!-- <script setup lang="ts">
import { isReactive, ref } from "vue";
import { useMainStore } from "../stores/main";

const mainStore = useMainStore();
const url = ref("");
const iframe = ref<HTMLIFrameElement>();

// TODO: switch to using an api, fetch and forward the text through a proxy server which allows for any origin
const handleNewSearch = (e: Event) => {
  e.preventDefault();
  if (!iframe.value) return;
  iframe.value.onload = () => {
    const doc = iframe.value?.contentWindow?.document;
    if (!doc) return;
    // const text = doc.body.innerText;
    // mainStore.loadText({ file: url.value, text });
  };
  iframe.value.src = url.value;
};
// const clickLoad = () => {
//   mainStore.loadText({ file: "firstFile.txt", text: text.value });
//   text.value = "";
// };
</script>

<template>
  <div>
    <h2>Load Webpage</h2>
    <form @submit="handleNewSearch">
      <input type="text" v-model="url" placeholder="URL" />
      <button type="submit">Load</button>
    </form>
    <iframe ref="iframe"></iframe>
  </div>
</template>

<style scoped></style> -->
