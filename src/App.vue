<script setup lang="ts">
import { ref } from "vue";
import LoadText from "./components/loadText.vue";
import ExportLoad from "./components/ExportLoad.vue";
import Search from "./components/Search.vue";
import LoadPDF from "./components/loadPDF.vue";
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
      Upload pdf/text/previous datasets and search through them with a vector
      search
    </p>
    <p>
      This project enables local search of large documents using a fuzzy search,
      which is great if you're not example sure what you are looking for.
    </p>
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
    <div class="tabs">
      <div class="load" v-if="currentTab === 'upload'">
        <p>
          Upload your data, once you have - save it for future use (if needed)
          and switch to the search tab.
        </p>
        <LoadText />
        <LoadPDF />
        <ExportLoad />
      </div>
      <div v-else-if="currentTab === 'data'">
        <h1>Data</h1>
        <ul v-if="mainStore.db.length">
          <li v-for="(item, index) in mainStore.db" :key="index">
            {{ item.text }}
            <small v-if="item.file">-- {{ item.file }}</small>
          </li>
        </ul>
        <p v-else>No data</p>
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
