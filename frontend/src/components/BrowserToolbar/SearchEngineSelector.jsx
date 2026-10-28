import { ChevronDown, Check } from "lucide-react";

import { useEffect, useRef, useState } from "react";

import { SEARCH_ENGINES } from "../../constants/browserConfig";

import { useBrowser } from "../../context/BrowserContext";

import styles from "./BrowserToolbar.module.css";

function SearchEngineSelector() {
  const { searchEngine, setSearchEngine } = useBrowser();

  const [open, setOpen] = useState(false);

  const rootRef = useRef(null);

  const currentEngine = SEARCH_ENGINES[searchEngine] ?? SEARCH_ENGINES.bing;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.searchEngineSelector}>
      <button
        type="button"
        className={styles.searchEngineButton}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        title={`Search with ${currentEngine.name}`}
      >
        <span className={styles.engineBadge}>{currentEngine.shortName}</span>

        <ChevronDown size={13} />
      </button>

      {open && (
        <div className={styles.engineMenu}>
          {Object.values(SEARCH_ENGINES).map((engine) => {
            const selected = engine.id === searchEngine;

            return (
              <button
                key={engine.id}
                type="button"
                className={styles.engineOption}
                onClick={() => {
                  setSearchEngine(engine.id);

                  setOpen(false);
                }}
              >
                <span className={styles.engineBadge}>{engine.shortName}</span>

                <span>{engine.name}</span>

                {selected && <Check size={15} />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default SearchEngineSelector;
