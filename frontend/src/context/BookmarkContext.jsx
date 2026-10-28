import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { STORAGE_KEYS } from "../constants/storageKeys";

import { getStoredData, saveStoredData } from "../utils/storage";

const BookmarkContext = createContext(null);

function generateBookmarkId() {
  return `bookmark-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BookmarkProvider({ children }) {
  const [bookmarks, setBookmarks] = useState(() =>
    getStoredData(STORAGE_KEYS.bookmarks, []),
  );

  const persistBookmarks = useCallback((nextBookmarks) => {
    setBookmarks(nextBookmarks);

    saveStoredData(STORAGE_KEYS.bookmarks, nextBookmarks);
  }, []);

  const addBookmark = useCallback(({ title, url, favicon }) => {
    if (!url || url === "browser://new-tab") {
      return;
    }

    setBookmarks((current) => {
      const alreadyExists = current.some((bookmark) => bookmark.url === url);

      if (alreadyExists) {
        return current;
      }

      const bookmark = {
        id: generateBookmarkId(),

        title: title || url,

        url,

        favicon: favicon || null,

        createdAt: new Date().toISOString(),
      };

      const next = [bookmark, ...current];

      saveStoredData(STORAGE_KEYS.bookmarks, next);

      return next;
    });
  }, []);

  const removeBookmark = useCallback((bookmarkId) => {
    setBookmarks((current) => {
      const next = current.filter((bookmark) => bookmark.id !== bookmarkId);

      saveStoredData(STORAGE_KEYS.bookmarks, next);

      return next;
    });
  }, []);

  const removeBookmarkByUrl = useCallback((url) => {
    setBookmarks((current) => {
      const next = current.filter((bookmark) => bookmark.url !== url);

      saveStoredData(STORAGE_KEYS.bookmarks, next);

      return next;
    });
  }, []);

  const isBookmarked = useCallback(
    (url) => {
      return bookmarks.some((bookmark) => bookmark.url === url);
    },
    [bookmarks],
  );

  const getBookmarkByUrl = useCallback(
    (url) => {
      return bookmarks.find((bookmark) => bookmark.url === url) ?? null;
    },
    [bookmarks],
  );

  const value = useMemo(
    () => ({
      bookmarks,

      addBookmark,
      removeBookmark,
      removeBookmarkByUrl,

      isBookmarked,
      getBookmarkByUrl,

      persistBookmarks,
    }),
    [
      bookmarks,
      addBookmark,
      removeBookmark,
      removeBookmarkByUrl,
      isBookmarked,
      getBookmarkByUrl,
      persistBookmarks,
    ],
  );

  return (
    <BookmarkContext.Provider value={value}>
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);

  if (!context) {
    throw new Error("useBookmarks must be used inside BookmarkProvider");
  }

  return context;
}
