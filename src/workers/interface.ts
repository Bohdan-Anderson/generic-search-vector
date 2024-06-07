import type { Entry } from "../types";

import heavyTask from "./embed?worker";

const worker = new heavyTask();

const listeners = new Set<Function>();

export type WorkerMessage = {
  taskId: string;
  type: "update" | "add";
  percentage: number;
  entries?: Entry[];
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
  worker.postMessage(data);
};
