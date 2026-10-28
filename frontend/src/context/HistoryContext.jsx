import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEYS } from "../constants/storageKeys";

import { getStoredData, saveStoredData } from "../utils/storage";

const HistoryContext = createContext(null);

function generateHistoryId() {
  return `history-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() =>
    getStoredData(STORAGE_KEYS.history, []),
  );

  useEffect(() => {
    const removeListener = window.browserAPI?.events?.onHistoryEntry?.(
      (entry) => {
        if (!entry?.url || !entry.url.startsWith("http")) {
          return;
        }

        setHistory((current) => {
          const first = current[0];

          if (first?.url === entry.url) {
            const updated = {
              ...first,

              title: entry.title || first.title,

              favicon: entry.favicon || first.favicon,

              visitedAt: entry.visitedAt,

              visitCount: (first.visitCount || 1) + 1,
            };

            const next = [updated, ...current.slice(1)];

            saveStoredData(STORAGE_KEYS.history, next);

            return next;
          }

          const historyEntry = {
            id: generateHistoryId(),

            title: entry.title || entry.url,

            url: entry.url,

            favicon: entry.favicon || null,

            visitedAt: entry.visitedAt || new Date().toISOString(),

            visitCount: 1,
          };

          const next = [historyEntry, ...current].slice(0, 1000);

          saveStoredData(STORAGE_KEYS.history, next);

          return next;
        });
      },
    );

    return () => {
      removeListener?.();
    };
  }, []);

  const removeHistoryEntry = useCallback((historyId) => {
    setHistory((current) => {
      const next = current.filter((entry) => entry.id !== historyId);

      saveStoredData(STORAGE_KEYS.history, next);

      return next;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);

    saveStoredData(STORAGE_KEYS.history, []);
  }, []);

  const value = useMemo(
    () => ({
      history,

      removeHistoryEntry,
      clearHistory,
    }),
    [history, removeHistoryEntry, clearHistory],
  );

  return (
    <HistoryContext.Provider value={value}>{children}</HistoryContext.Provider>
  );
}

export function useHistory() {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error("useHistory must be used inside HistoryProvider");
  }

  return context;
}
