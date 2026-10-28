import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Home,
  MoreVertical,
  Puzzle,
  RefreshCw,
  UserRound,
  X,
} from "lucide-react";

import { useBrowser } from "../../context/BrowserContext";
import AddressBar from "./AddressBar";
import { useBookmarks } from "../../context/BookmarkContext";
import { useDownloads } from "../../context/DownloadContext";
import styles from "./BrowserToolbar.module.css";

function BrowserToolbar() {
  const {
    activeTab,
    goBack,
    goForward,
    reloadOrStop,
    goHome,
    openInternalPage,
  } = useBrowser();

  const isNewTab = activeTab?.url === "browser://new-tab";
  const { addBookmark, removeBookmarkByUrl, isBookmarked } = useBookmarks();
  const bookmarked =
    activeTab &&
    activeTab.url !== "browser://new-tab" &&
    isBookmarked(activeTab.url);
  const { activeDownloadCount } = useDownloads();
  const handleDownloadsClick = () => {
    openInternalPage("downloads");
  };
  const toggleBookmark = () => {
    if (!activeTab || activeTab.url === "browser://new-tab") {
      return;
    }

    if (bookmarked) {
      removeBookmarkByUrl(activeTab.url);

      return;
    }

    addBookmark({
      title: activeTab.title,

      url: activeTab.url,

      favicon: activeTab.favicon,
    });
  };
  return (
    <div className={styles.toolbar}>
      <section className={styles.navigationControls}>
        <button
          type="button"
          className={styles.toolbarButton}
          onClick={goBack}
          disabled={!activeTab?.canGoBack}
          title="Back"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={goForward}
          disabled={!activeTab?.canGoForward}
          title="Forward"
          aria-label="Forward"
        >
          <ArrowRight size={20} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={reloadOrStop}
          disabled={isNewTab}
          title={activeTab?.loading ? "Stop loading" : "Reload"}
          aria-label={activeTab?.loading ? "Stop loading" : "Reload"}
        >
          {activeTab?.loading ? <X size={19} /> : <RefreshCw size={19} />}
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={goHome}
          title="Safora Home"
          aria-label="Safora Home"
        >
          <Home size={20} />
        </button>
      </section>

      <AddressBar />

      <section className={styles.browserActions}>
        <button
          type="button"
          className={`${styles.toolbarButton} ${
            bookmarked ? styles.bookmarkedButton : ""
          }`}
          onClick={toggleBookmark}
          disabled={!activeTab || activeTab.url === "browser://new-tab"}
          title={bookmarked ? "Remove bookmark" : "Bookmark this page"}
          aria-label={bookmarked ? "Remove bookmark" : "Bookmark this page"}
        >
          <Bookmark size={20} fill={bookmarked ? "currentColor" : "none"} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          title="Extensions"
          aria-label="Extensions"
        >
          <Puzzle size={19} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          onClick={handleDownloadsClick}
          title="Downloads"
          aria-label="Downloads"
        >
          <span className={styles.downloadButtonContent}>
            <ArrowDownToLine size={20} />

            {activeDownloadCount > 0 && (
              <span className={styles.downloadBadge}>
                {activeDownloadCount > 9 ? "9+" : activeDownloadCount}
              </span>
            )}
          </span>
        </button>

        <button
          type="button"
          className={styles.profileButton}
          title="Profile"
          aria-label="Profile"
        >
          <UserRound size={20} />
        </button>

        <button
          type="button"
          className={styles.toolbarButton}
          title="Safora Browser menu"
          aria-label="Safora Browser menu"
        >
          <MoreVertical size={20} />
        </button>
      </section>
    </div>
  );
}

export default BrowserToolbar;
