import BrowserTabs from "../../components/BrowserTabs/BrowserTabs";
import BrowserToolbar from "../../components/BrowserToolbar/BrowserToolbar";
import WindowControls from "../../components/WindowControls/WindowControls";
import { useBrowser } from "../../context/BrowserContext";
import NewTabPage from "../../pages/NewTabPage/NewTabPage";
import useBrowserShortcuts from "../../hooks/useBrowserShortcuts";
import FindBar from "../../components/BrowserToolbar/FindBar";
import styles from "./BrowserLayout.module.css";

function BrowserLayout() {
  const { activeTab } = useBrowser();
  useBrowserShortcuts();
  const showingDashboard = !activeTab || activeTab.url === "browser://new-tab";

  return (
    <main className={styles.browser}>
      <header className={styles.topArea}>
        <div className={styles.tabRow}>
          <div className={styles.windowDots}>
            <span className={styles.redDot} />

            <span className={styles.yellowDot} />

            <span className={styles.greenDot} />
          </div>

          <BrowserTabs />

          <WindowControls />
        </div>

        <BrowserToolbar />
        <FindBar />
      </header>

      <section className={styles.browserContent}>
        {showingDashboard ? (
          <NewTabPage />
        ) : (
          <div className={styles.externalPagePlaceholder} aria-hidden="true" />
        )}
      </section>
    </main>
  );
}

export default BrowserLayout;
