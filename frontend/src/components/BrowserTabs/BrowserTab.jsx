import { Globe2, LoaderCircle, X } from "lucide-react";

import styles from "./BrowserTabs.module.css";

function BrowserTab({ tab, active, onSelect, onClose }) {
  const handleSelect = () => {
    onSelect(tab.id);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect();
    }
  };

  const handleClose = (event) => {
    event.stopPropagation();
    onClose(tab.id);
  };

  const title = tab.title?.trim() || "New Tab";

  return (
    <div
      className={`${styles.tab} ${active ? styles.activeTab : ""}`}
      role="tab"
      aria-selected={active}
      tabIndex={active ? 0 : -1}
      title={title}
      onClick={handleSelect}
      onKeyDown={handleKeyDown}
    >
      <span className={styles.tabIcon}>
        {tab.loading ? (
          <LoaderCircle
            className={styles.loadingIcon}
            size={16}
            strokeWidth={2}
          />
        ) : tab.favicon ? (
          <img
            src={tab.favicon}
            alt=""
            className={styles.favicon}
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        ) : (
          <Globe2 size={16} strokeWidth={2} />
        )}
      </span>

      <span className={styles.tabTitle}>{title}</span>

      <button
        type="button"
        className={styles.closeTab}
        onClick={handleClose}
        aria-label={`Close ${title}`}
        title={`Close ${title}`}
      >
        <X size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

export default BrowserTab;
