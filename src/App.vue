<script setup lang="ts">
import { ref } from "vue";
import LoadText from "./components/loadText.vue";
import ExportLoad from "./components/ExportLoad.vue";
import Search from "./components/Search.vue";
import LoadPDF from "./components/loadPDF.vue";
import YoutubeTranscript from "./components/YoutubeTranscript.vue";
import Data from "./components/Data.vue";
import { useMainStore } from "./stores/main";

const mainStore = useMainStore();

const currentTab = ref<"upload" | "search" | "data">("upload");
</script>

<template>
  <div v-if="mainStore.loading">Loading: {{ mainStore.loading }}</div>
  <!-- for each  -->
  <div
    class="loading-container"
    v-for="value in Object.entries(mainStore.workers)"
    :key="value[0]"
  >
    <div
      class="loading-bar"
      :style="{ transform: `scaleX(${value[1]}%)` }"
    ></div>
  </div>

  <div v-if="!mainStore.loading">
    <h1>Local vector search</h1>
    <p>
      This is a simple example of using embeddings and vector search to query a
      dataset. All data is stored locally in your browser, embedding is done in
      browser and nothing is sent to a server.
    </p>
    <ol>
      <li>Upload your text/PDF/previous dataset</li>
      <li>Save the data (for future use)</li>
      <li>Switch to the search tab and query your data</li>
    </ol>
    <nav class="">
      <button
        @click="currentTab = 'upload'"
        :class="currentTab === 'upload' ? 'active' : ''"
      >
        Upload
      </button>
      <button
        @click="currentTab = 'data'"
        :class="currentTab === 'data' ? 'active' : ''"
      >
        Data
        <small v-if="mainStore.db.length"
          >{{ mainStore.db.length }} entries</small
        >
      </button>
      <button
        @click="currentTab = 'search'"
        :class="currentTab === 'search' ? 'active' : ''"
      >
        Search
      </button>
    </nav>
    <div v-if="mainStore.loadingEmbeddingModel">
      <p>Loading embedding model</p>
    </div>
    <div class="tabs" v-else>
      <div class="load" v-if="currentTab === 'upload'">
        <p>
          Upload your data, once you have - save it for future use (if needed)
          and switch to the search tab.
        </p>
        <LoadText />
        <LoadPDF />
        <ExportLoad />
        <YoutubeTranscript />
      </div>
      <div v-else-if="currentTab === 'data'">
        <Data />
      </div>
      <div v-else-if="currentTab === 'search'">
        <Search />
      </div>
    </div>
  </div>
  <div v-else>
    <p>{{ mainStore.loading }}</p>
  </div>
</template>

<style scoped>
.loading-container {
  display: block;
  height: 5px;
  width: 100%;
  position: relative;
}
.loading-bar {
  height: 5px;
  background-color: #4caf50;
  width: 100%;
  transform-origin: left;
}

nav {
  display: flex;
  flex-direction: row;
  padding-left: 10px;
}

.tabs {
  border: solid 1px #ddd;
  padding: 10px;
  border-radius: 10px;
}
</style>
