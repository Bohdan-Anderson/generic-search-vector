const MODEL = "Xenova/all-MiniLM-L6-v2";
import { pipeline, env } from "@xenova/transformers";
env.allowLocalModels = false;
import type { FeatureExtractionPipeline } from "@xenova/transformers";
let pipe: null | FeatureExtractionPipeline = null;
pipeline("feature-extraction", MODEL).then((p) => (pipe = p));

export default async function getVector(input: string) {
  if (!pipe) throw new Error("Model not loaded");
  const embedding = await pipe(input, { pooling: "mean", normalize: true });
  return Array.from(embedding.data);
}
