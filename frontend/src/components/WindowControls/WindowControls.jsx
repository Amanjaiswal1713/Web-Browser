import { useEffect, useState } from "react";
import { Minus, Square, Copy, X } from "lucide-react";

import styles from "./WindowControls.module.css";

function WindowControls() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const windowControls = window.browserAPI?.windowControls;

    if (!windowControls) {
      return undefined;
    }

    windowControls
      .isMaximized()
      .then((maximized) => {
        setIsMaximized(Boolean(maximized));
      })
      .catch(() => {
        setIsMaximized(false);
      });

    const removeListener = windowControls.onMaximizedChange((maximized) => {
      setIsMaximized(Boolean(maximized));
    });

    return removeListener;
  }, []);

  const minimizeWindow = () => {
    window.browserAPI?.windowControls.minimize();
  };

  const toggleMaximizeWindow = () => {
    window.browserAPI?.windowControls.toggleMaximize();
  };

  const closeWindow = () => {
    window.browserAPI?.windowControls.close();
  };

  return (
    <div className={styles.controls}>
      <button
        type="button"
        className={styles.controlButton}
        onClick={minimizeWindow}
        aria-label="Minimize window"
        title="Minimize"
      >
        <Minus size={17} strokeWidth={1.8} />
      </button>

      <button
        type="button"
        className={styles.controlButton}
        onClick={toggleMaximizeWindow}
        aria-label={isMaximized ? "Restore window" : "Maximize window"}
        title={isMaximized ? "Restore" : "Maximize"}
      >
        {isMaximized ? (
          <Copy size={14} strokeWidth={1.8} />
        ) : (
          <Square size={14} strokeWidth={1.8} />
        )}
      </button>

      <button
        type="button"
        className={`${styles.controlButton} ${styles.closeButton}`}
        onClick={closeWindow}
        aria-label="Close window"
        title="Close"
      >
        <X size={18} strokeWidth={1.8} />
      </button>
    </div>
  );
}

export default WindowControls;
