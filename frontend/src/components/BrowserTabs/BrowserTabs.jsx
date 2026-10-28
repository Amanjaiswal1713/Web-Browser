import { Plus } from "lucide-react";

import { useBrowser } from "../../context/BrowserContext";
import BrowserTab from "./BrowserTab";

import styles from "./BrowserTabs.module.css";

function BrowserTabs() {
  const { tabs, activeTabId, createNewTab, selectTab, closeTab } = useBrowser();

  return (
    <div className={styles.tabsArea} role="tablist" aria-label="Browser tabs">
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <BrowserTab
            key={tab.id}
            tab={tab}
            active={tab.id === activeTabId}
            onSelect={selectTab}
            onClose={closeTab}
          />
        ))}
      </div>

      <button
        type="button"
        className={styles.newTabButton}
        onClick={() => createNewTab()}
        aria-label="Open new tab"
        title="New tab"
      >
        <Plus size={19} />
      </button>
    </div>
  );
}

export default BrowserTabs;
