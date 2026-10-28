import { Bookmark, ExternalLink, Globe2, Search, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";

import { useBookmarks } from "../../context/BookmarkContext";

import { useBrowser } from "../../context/BrowserContext";

import styles from "./BookmarksPage.module.css";

function BookmarksPage({ onBackHome }) {
  const { bookmarks, removeBookmark } = useBookmarks();

  const { navigate } = useBrowser();

  const [search, setSearch] = useState("");

  const filteredBookmarks = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return bookmarks;
    }

    return bookmarks.filter(
      (bookmark) =>
        bookmark.title?.toLowerCase().includes(query) ||
        bookmark.url?.toLowerCase().includes(query),
    );
  }, [bookmarks, search]);

  const openBookmark = async (url) => {
    await navigate(url);
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div>
          <Bookmark size={27} />

          <div>
            <h1>Bookmarks</h1>

            <p>Your saved pages</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackHome}
          className={styles.homeButton}
        >
          Safora Home
        </button>
      </header>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search bookmarks..."
        />
      </div>

      {filteredBookmarks.length === 0 ? (
        <div className={styles.emptyState}>
          <Bookmark size={44} />

          <h2>No bookmarks found</h2>

          <p>Save a webpage using the bookmark button in the Safora toolbar.</p>
        </div>
      ) : (
        <div className={styles.bookmarkGrid}>
          {filteredBookmarks.map((bookmark) => (
            <article key={bookmark.id} className={styles.bookmarkCard}>
              <div className={styles.favicon}>
                {bookmark.favicon ? (
                  <img src={bookmark.favicon} alt="" />
                ) : (
                  <Globe2 size={22} />
                )}
              </div>

              <div className={styles.bookmarkDetails}>
                <h2>{bookmark.title}</h2>

                <p>{bookmark.url}</p>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => openBookmark(bookmark.url)}
                  title="Open bookmark"
                >
                  <ExternalLink size={17} />
                </button>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeBookmark(bookmark.id)}
                  title="Delete bookmark"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default BookmarksPage;
