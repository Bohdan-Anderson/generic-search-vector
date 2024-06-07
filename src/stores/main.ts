import { defineStore } from "pinia";
import { ref } from "vue";
import getVector from "../utils/transformers";
import { queryItems } from "../utils/search";
import { Entry } from "../types";
import { addListener, sendTextToWorker } from "../workers/interface";
import type { WorkerMessage } from "../workers/interface";

type CurrentWorkers = {
  [key: string]: number;
};

export const useMainStore = defineStore("main", () => {
  const db = ref([] as Entry[]);
  const loading = ref("");
  const searching = ref(false);
  const results = ref([] as { item: Entry; score: number }[]);
  const workers = ref({} as CurrentWorkers);

  const addToDB = (data: WorkerMessage) => {
    if (data.entries) {
      db.value.push(...data.entries);
    }
    workers.value[data.taskId] = data.percentage;
    if (data.percentage === 100) delete workers.value[data.taskId];
  };

  addListener(addToDB);

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
    sendTextToWorker({
      file,
      text,
      size,
      overlap,
    });
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
    workers,
    setDB,
    loadText,
    search,
  };
});
