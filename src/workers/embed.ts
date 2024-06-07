import type { Entry } from "../types";
import getVector from "../utils/transformers";
import { normalize } from "../utils/search";

const createRandomId = () => Math.random().toString(36).substring(7);

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

self.addEventListener(
  "message",
  async (e: {
    data: {
      text: string;
      file: string;
      size: number;
      overlap: number;
    };
  }) => {
    const taskId = createRandomId();
    const { text, file, size, overlap } = e.data;
    const chunks = chunkText(text, size, overlap);
    const date = new Date();
    const vectors = [] as Entry[];
    for (let i = 0; i < chunks.length; i++) {
      self.postMessage({
        taskId,
        type: "update",
        percentage: Math.floor((i / chunks.length) * 100),
      });
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
    self.postMessage({
      taskId,
      entries: vectors,
      type: "add",
      percentage: 100,
    });
  }
);
