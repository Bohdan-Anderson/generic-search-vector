import { defineStore } from "pinia";
import { ref } from "vue";
import { queryItems } from "../utils/search";
import { Entry } from "../types";
import * as embed from "../workers/interfaceEmbed";
import * as summarize from "../workers/interfaceSummarize";
// {
//   addListener,
//   getEmbed,
//   sendTextToWorker,
//   removeListener,
//   checkIfLoaded,
// }
import type { WorkerMessage } from "../workers/interfaceEmbed";
import type { SummarizeMessage } from "../workers/interfaceSummarize";

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
  const summarized = ref("");
  const workers = ref({} as CurrentWorkers);
  const loadingEmbeddingModel = ref(true);
  const loadingSummarizeModel = ref(true);

  const addToDB = (data: WorkerMessage) => {
    if (data.type === "add" && data.entries) {
      db.value.push(...data.entries);
    }
    workers.value[data.taskId] = data.percentage;
    if (data.percentage === 100) delete workers.value[data.taskId];
  };

  const embeddingOnload = (data: WorkerMessage) => {
    if (data.type === "loaded") {
      loadingEmbeddingModel.value = false;
      embed.removeListener(embeddingOnload);
    }
  };

  const summarizeOnload = (data: SummarizeMessage) => {
    if (data.type === "loaded") {
      loadingSummarizeModel.value = false;
      summarize.removeListener(summarizeOnload);
      delete workers.value[data.taskId];
    }
  };
  const summarizeOnUpdate = (data: SummarizeMessage) => {
    if (data.type === "update") {
      workers.value[data.taskId] = data.percentage;
      if (data.percentage === 100) delete workers.value[data.taskId];
    }
  };

  const summarizedResults = (data: SummarizeMessage) => {
    console.log(data);
    if (data.type === "summarize") {
      summarized.value = data.text;
    }
  };

  embed.addListener(addToDB);
  embed.addListener(embeddingOnload);
  embed.checkIfLoaded();

  summarize.addListener(summarizedResults);
  summarize.addListener(summarizeOnUpdate);
  summarize.addListener(summarizeOnload);
  summarize.checkIfLoaded();

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
    embed.sendTextToWorker({
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
    summarized.value = "";
    const queryVector = await embed.getEmbed(query);
    results.value = await queryItems(db.value, queryVector, 5);
    summarize.getSummarize(results.value.map((x) => x.item.text).join(" "));

    searching.value = false;
    return true;
  };

  return {
    db,
    loading,
    searching,
    results,
    summarized,
    workers,
    loadingEmbeddingModel,
    setDB,
    loadText,
    search,
  };
});
