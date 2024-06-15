// setting up the model
import type {
  SummarizeMessage,
  SummarizePostMessage,
} from "./interfaceSummarize";
import { createRandomId } from "../utils/utils";
import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
import type { SummarizationPipeline } from "@xenova/transformers";
let generator: null | SummarizationPipeline = null;
pipeline("summarization", "Xenova/distilbart-cnn-6-6").then(
  (p) => (generator = p)
);

async function summarizeText(input: string) {
  if (!generator) throw new Error("Model not loaded");
  const embedding = await generator(input);
  return (embedding[0] as { summary_text: string })?.summary_text;
}

self.addEventListener("message", async (e: { data: SummarizePostMessage }) => {
  const taskId = createRandomId();
  switch (e.data.type) {
    case "summarize":
      const { text } = e.data;
      self.postMessage({
        taskId,
        type: "update",
        percentage: 25,
      } satisfies SummarizeMessage);
      const summary = await summarizeText(text);
      self.postMessage({
        taskId,
        type: "update",
        percentage: 100,
      } satisfies SummarizeMessage);
      self.postMessage({
        taskId,
        type: "summarize",
        text: summary,
      } satisfies SummarizeMessage);
      break;
    case "loaded":
      self.postMessage({
        taskId,
        type: "loaded",
        percentage: 100,
      } satisfies SummarizeMessage);
      break;
  }
});
