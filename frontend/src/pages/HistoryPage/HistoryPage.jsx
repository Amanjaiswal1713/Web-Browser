import { ArrowUpRight, Clock3, Globe2, Search, Trash2 } from "lucide-react";

import { useMemo, useState } from "react";

import { useBrowser } from "../../context/BrowserContext";

import { useHistory } from "../../context/HistoryContext";

import styles from "./HistoryPage.module.css";

function formatVisitedAt(dateString) {
  if (!dateString) {
    return "";
  }

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function HistoryPage({ onBackHome }) {
  const { history, removeHistoryEntry, clearHistory } = useHistory();

  const { navigate } = useBrowser();

  const [search, setSearch] = useState("");

  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const filteredHistory = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return history;
    }

    return history.filter(
      (entry) =>
        entry.title?.toLowerCase().includes(query) ||
        entry.url?.toLowerCase().includes(query),
    );
  }, [history, search]);

  const openHistoryEntry = async (url) => {
    await navigate(url);
  };

  const handleClearHistory = () => {
    clearHistory();

    setShowClearConfirm(false);
  };

  return (
    <section className={styles.page}>
      <header className={styles.pageHeader}>
        <div className={styles.heading}>
          <span className={styles.headingIcon}>
            <Clock3 size={24} />
          </span>

          <div>
            <h1>Browsing History</h1>

            <p>Pages visited in Safora</p>
          </div>
        </div>

        <div className={styles.headerActions}>
          {history.length > 0 && (
            <button
              type="button"
              className={styles.clearButton}
              onClick={() => setShowClearConfirm(true)}
            >
              <Trash2 size={16} />
              Clear History
            </button>
          )}

          <button
            type="button"
            className={styles.homeButton}
            onClick={onBackHome}
          >
            Safora Home
          </button>
        </div>
      </header>

      <div className={styles.searchBox}>
        <Search size={18} />

        <input
          type="text"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search browsing history..."
        />
      </div>

      {filteredHistory.length === 0 ? (
        <div className={styles.emptyState}>
          <Clock3 size={46} />

          <h2>{search ? "No matching history" : "No browsing history"}</h2>

          <p>
            {search
              ? "Try another search."
              : "Webpages you visit in Safora will appear here."}
          </p>
        </div>
      ) : (
        <div className={styles.historyList}>
          {filteredHistory.map((entry) => (
            <article key={entry.id} className={styles.historyItem}>
              <div className={styles.favicon}>
                {entry.favicon ? (
                  <img
                    src={entry.favicon}
                    alt=""
                    className={styles.faviconImage}
                    onError={(event) => {
                      event.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <Globe2 size={21} />
                )}
              </div>

              <div className={styles.historyDetails}>
                <h2 title={entry.title}>{entry.title}</h2>

                <p title={entry.url}>{entry.url}</p>
              </div>

              <div className={styles.visitDetails}>
                <span>{formatVisitedAt(entry.visitedAt)}</span>

                {entry.visitCount > 1 && (
                  <small>{entry.visitCount} visits</small>
                )}
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  onClick={() => openHistoryEntry(entry.url)}
                  title="Open page"
                  aria-label="Open page"
                >
                  <ArrowUpRight size={17} />
                </button>

                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => removeHistoryEntry(entry.id)}
                  title="Remove from history"
                  aria-label="Remove from history"
                >
                  <Trash2 size={17} />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {showClearConfirm && (
        <div
          className={styles.dialogBackdrop}
          onMouseDown={() => setShowClearConfirm(false)}
        >
          <div
            className={styles.confirmDialog}
            onMouseDown={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="clear-history-title"
          >
            <span className={styles.warningIcon}>
              <Trash2 size={25} />
            </span>

            <h2 id="clear-history-title">Clear browsing history?</h2>

            <p>
              This will remove the locally stored Safora browsing-history
              entries.
            </p>

            <div className={styles.dialogActions}>
              <button type="button" onClick={() => setShowClearConfirm(false)}>
                Cancel
              </button>

              <button
                type="button"
                className={styles.confirmClearButton}
                onClick={handleClearHistory}
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default HistoryPage;
