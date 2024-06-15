import Worker from "./summarize?worker";

const summarizeWorker = new Worker();

const listeners = new Set<Function>();

// coming from the worker to the main thread
export type SummarizeMessage =
  | {
      taskId: string;
      type: "update";
      percentage: number;
    }
  | {
      taskId: string;
      type: "loaded";
      percentage: number;
    }
  | {
      taskId: string;
      type: "summarize";
      text: string;
    };

// coming from the main thread to the worker
export type SummarizePostMessage =
  | {
      type: "summarize";
      text: string;
    }
  | {
      type: "loaded";
      percentage: number;
    };

summarizeWorker.addEventListener("message", (e: { data: SummarizeMessage }) => {
  listeners.forEach((listener) => listener(e.data));
});

type ListenerProps = (data: SummarizeMessage) => void;
export const addListener = (callback: ListenerProps) => {
  listeners.add(callback);
};
export const removeListener = (callback: ListenerProps) => {
  listeners.delete(callback);
};

export const checkIfLoaded = async () => {
  summarizeWorker.postMessage({ type: "loaded" });
};

export const getSummarize = async (text: string): Promise<string> => {
  summarizeWorker.postMessage({
    type: "summarize",
    text,
  } satisfies SummarizePostMessage);
  return await new Promise((resolve) => {
    const listener = (data: SummarizeMessage) => {
      if (data.type === "summarize") {
        removeListener(listener);
        resolve(data.text);
      }
    };
    addListener(listener);
  });
};
