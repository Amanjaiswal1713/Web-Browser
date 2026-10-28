import { ChevronDown, ChevronUp, X } from "lucide-react";

import { useEffect, useRef } from "react";

import { useBrowser } from "../../context/BrowserContext";

import styles from "./FindBar.module.css";

function FindBar() {
  const inputRef = useRef(null);

  const { activeTab, setFindQuery, findNext, findPrevious, closeFind } =
    useBrowser();

  const find = activeTab?.find;

  useEffect(() => {
    if (find?.open) {
      inputRef.current?.focus();

      inputRef.current?.select();
    }
  }, [find?.open]);

  if (!find?.open) {
    return null;
  }

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();

      closeFind();

      return;
    }

    if (event.key === "Enter") {
      event.preventDefault();

      if (event.shiftKey) {
        findPrevious();
      } else {
        findNext();
      }
    }
  };

  const resultText =
    find.matches > 0 ? `${find.activeMatch} / ${find.matches}` : "0 / 0";

  return (
    <div className={styles.findBar}>
      <input
        ref={inputRef}
        type="text"
        value={find.query}
        onChange={(event) => setFindQuery(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Find in page"
        spellCheck="false"
      />

      <span className={styles.resultCount}>{resultText}</span>

      <button
        type="button"
        onClick={findPrevious}
        disabled={!find.query}
        title="Previous match"
      >
        <ChevronUp size={17} />
      </button>

      <button
        type="button"
        onClick={findNext}
        disabled={!find.query}
        title="Next match"
      >
        <ChevronDown size={17} />
      </button>

      <button type="button" onClick={closeFind} title="Close">
        <X size={17} />
      </button>
    </div>
  );
}

export default FindBar;
