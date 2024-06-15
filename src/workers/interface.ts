import type { Entry } from "../types";

import heavyTask from "./embed?worker";

const worker = new heavyTask();

const listeners = new Set<Function>();

export type WorkerMessage =
  | {
      taskId: string;
      type: "update" | "add";
      percentage: number;
      entries?: Entry[];
    }
  | {
      taskId: string;
      type: "embed";
      text: string;
      vector: number[];
      percentage: number;
    };

worker.addEventListener("message", (e: { data: WorkerMessage }) => {
  listeners.forEach((listener) => listener(e.data));
});

type ListenerProps = (data: WorkerMessage) => void;
export const addListener = (callback: ListenerProps) => {
  listeners.add(callback);
};
export const removeListener = (callback: ListenerProps) => {
  listeners.delete(callback);
};

export const sendTextToWorker = (data: {
  text: string;
  file: string;
  overlap: number;
  size: number;
}) => {
  worker.postMessage({ type: "add", ...data });
};

// we wait for the worker to send the vector
export const getEmbed = async (text: string): Promise<number[]> => {
  worker.postMessage({ type: "embed", text });
  return await new Promise((resolve) => {
    const listener = (data: WorkerMessage) => {
      if (data.type === "embed") {
        console.log(`received vector ${data.text}`, data.vector[0]);
        removeListener(listener);
        resolve(data.vector);
      }
    };
    addListener(listener);
  });
};
