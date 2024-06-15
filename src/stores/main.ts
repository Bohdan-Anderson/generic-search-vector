import { defineStore } from "pinia";
import { ref } from "vue";
import { queryItems } from "../utils/search";
import { Entry } from "../types";
import { addListener, getEmbed, sendTextToWorker } from "../workers/interface";
import type { WorkerMessage } from "../workers/interface";

type CurrentWorkers = {
  [key: string]: number;
};

export const useMainStore = defineStore("main", () => {
  const db = ref([] as Entry[]);
  const loading = ref("");
  const searching = ref(false);
  const results = ref(
    [] as { item: Entry; score: number; contextText: string[] }[]
  );
  const workers = ref({} as CurrentWorkers);

  const addToDB = (data: WorkerMessage) => {
    if (data.type === "add" && data.entries) {
      db.value.push(...data.entries);
    }
    workers.value[data.taskId] = data.percentage;
    if (data.percentage === 100) delete workers.value[data.taskId];
  };

  addListener(addToDB);

  const loadText = async ({
    file,
    text,
    size = 80,
    overlap = 20,
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
    const queryVector = await getEmbed(query);
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
