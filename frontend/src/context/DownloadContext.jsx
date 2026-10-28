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

const DownloadContext = createContext(null);

function sanitizeDownloads(storedDownloads) {
  if (!Array.isArray(storedDownloads)) {
    return [];
  }

  return storedDownloads.map((download) => {
    const wasActive =
      download.status === "progressing" || download.status === "paused";

    if (!wasActive) {
      return download;
    }

    return {
      ...download,
      status: "interrupted",
      paused: false,
      canResume: false,
    };
  });
}

export function DownloadProvider({ children }) {
  const [downloads, setDownloads] = useState(() => {
    const stored = getStoredData(STORAGE_KEYS.downloads, []);

    const sanitized = sanitizeDownloads(stored);

    saveStoredData(STORAGE_KEYS.downloads, sanitized);

    return sanitized;
  });

  const updateDownload = useCallback((incomingDownload) => {
    if (!incomingDownload?.id) {
      return;
    }

    setDownloads((currentDownloads) => {
      const exists = currentDownloads.some(
        (download) => download.id === incomingDownload.id,
      );

      const nextDownloads = exists
        ? currentDownloads.map((download) =>
            download.id === incomingDownload.id
              ? {
                  ...download,
                  ...incomingDownload,
                }
              : download,
          )
        : [incomingDownload, ...currentDownloads];

      saveStoredData(STORAGE_KEYS.downloads, nextDownloads);

      return nextDownloads;
    });
  }, []);

  useEffect(() => {
    const removeStarted =
      window.browserAPI?.events?.onDownloadStarted?.(updateDownload);

    const removeUpdated =
      window.browserAPI?.events?.onDownloadUpdated?.(updateDownload);

    const removeFinished =
      window.browserAPI?.events?.onDownloadFinished?.(updateDownload);

    return () => {
      removeStarted?.();
      removeUpdated?.();
      removeFinished?.();
    };
  }, [updateDownload]);

  const pauseDownload = useCallback((downloadId) => {
    return window.browserAPI?.downloads?.pause(downloadId);
  }, []);

  const resumeDownload = useCallback((downloadId) => {
    return window.browserAPI?.downloads?.resume(downloadId);
  }, []);

  const cancelDownload = useCallback((downloadId) => {
    return window.browserAPI?.downloads?.cancel(downloadId);
  }, []);

  const openDownload = useCallback((filePath) => {
    return window.browserAPI?.downloads?.openFile(filePath);
  }, []);

  const showDownloadInFolder = useCallback((filePath) => {
    return window.browserAPI?.downloads?.showInFolder(filePath);
  }, []);

  const removeDownload = useCallback((downloadId) => {
    setDownloads((currentDownloads) => {
      const nextDownloads = currentDownloads.filter(
        (download) => download.id !== downloadId,
      );

      saveStoredData(STORAGE_KEYS.downloads, nextDownloads);

      return nextDownloads;
    });
  }, []);

  const clearFinishedDownloads = useCallback(() => {
    setDownloads((currentDownloads) => {
      const nextDownloads = currentDownloads.filter((download) => {
        return (
          download.status === "progressing" || download.status === "paused"
        );
      });

      saveStoredData(STORAGE_KEYS.downloads, nextDownloads);

      return nextDownloads;
    });
  }, []);

  const activeDownloadCount = useMemo(() => {
    return downloads.filter((download) => {
      return download.status === "progressing" || download.status === "paused";
    }).length;
  }, [downloads]);

  const value = useMemo(
    () => ({
      downloads,
      activeDownloadCount,

      pauseDownload,
      resumeDownload,
      cancelDownload,

      openDownload,
      showDownloadInFolder,

      removeDownload,
      clearFinishedDownloads,
    }),
    [
      downloads,
      activeDownloadCount,

      pauseDownload,
      resumeDownload,
      cancelDownload,

      openDownload,
      showDownloadInFolder,

      removeDownload,
      clearFinishedDownloads,
    ],
  );

  return (
    <DownloadContext.Provider value={value}>
      {children}
    </DownloadContext.Provider>
  );
}

export function useDownloads() {
  const context = useContext(DownloadContext);

  if (!context) {
    throw new Error("useDownloads must be used inside DownloadProvider");
  }

  return context;
}
