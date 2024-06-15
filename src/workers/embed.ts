import type { Entry } from "../types";
import { normalize } from "../utils/search";
import { createRandomId } from "../utils/utils";

// setting up the model

const MODEL = "Xenova/all-MiniLM-L6-v2";
import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
import type { FeatureExtractionPipeline } from "@xenova/transformers";
let pipe: null | FeatureExtractionPipeline = null;
pipeline("feature-extraction", MODEL).then((p) => (pipe = p));

async function getVector(input: string) {
  if (!pipe) throw new Error("Model not loaded");
  const embedding = await pipe(input, { pooling: "mean", normalize: true });
  return Array.from(embedding.data);
}

// everything below is the worker

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
      type: string;
      text: string;
      file: string;
      size: number;
      overlap: number;
    };
  }) => {
    const taskId = createRandomId();
    switch (e.data.type) {
      // for adding data into the DB we chunk and embed all the text
      case "add":
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
        break;

      // used in search, to embed the query
      case "embed":
        self.postMessage({
          taskId,
          type: "update",
          percentage: 0,
        });
        const vector = await getVector(e.data.text);
        self.postMessage({
          taskId,
          text: e.data.text,
          vector: vector,
          type: "embed",
          percentage: 100,
        });
        break;

      case "loaded":
        self.postMessage({
          taskId,
          type: "loaded",
          percentage: 100,
        });
        break;
      default:
        break;
    }
  }
);
