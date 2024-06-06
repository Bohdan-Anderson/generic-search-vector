import { defineStore } from "pinia";
import { ref } from "vue";
import getVector from "../utils/transformers";
import { queryItems, normalize } from "../utils/search";
import { Entry } from "../types";

const chunkText = (text: string, size: number, overlap: number) => {
  const chunks = [];
  const split = text.replace("\n", " ").split(" ");

  for (let i = 0; i < split.length; i += size) {
    const start = Math.max(0, i - overlap);
    const end = Math.min(split.length, i + size + overlap);
    const chunk = split.slice(start, end);
    chunks.push(chunk);
  }
  return chunks;
};

export const useMainStore = defineStore("main", () => {
  const db = ref([] as Entry[]);
  const loading = ref("");
  const searching = ref(false);
  const results = ref([] as { item: Entry; score: number }[]);

  const loadText = async ({
    file,
    text,
    size = 40,
    overlap = 10,
  }: {
    file: string;
    text: string;
    /** number of words */
    size?: number;
    /** overlap of words */
    overlap?: number;
  }) => {
    loading.value = "starting...";
    const chunks = chunkText(text, size, overlap);
    const date = new Date();
    const vectors = [] as Entry[];
    for (let i = 0; i < chunks.length; i++) {
      loading.value = Math.floor((i / chunks.length) * 100) + "%";
      const chunk = chunks[i];
      const vector = await getVector(chunk.join(" "));
      vectors.push({
        file,
        text: chunk.join(" "),
        vectors: vector,
        date,
        norm: normalize(vector),
      });
    }
    db.value.push(...vectors);
    loading.value = "";
  };

  const setDB = async (backup: Entry[]) => {
    db.value = backup;
  };

  const search = async (query: string) => {
    searching.value = true;
    const queryVector = await getVector(query);
    results.value = await queryItems(db.value, queryVector, 5);
    searching.value = false;
    return true;
  };

  return {
    db,
    loading,
    searching,
    results,
    setDB,
    loadText,
    search,
  };
});
