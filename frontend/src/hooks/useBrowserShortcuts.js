import { useEffect } from "react";

import { useBrowser } from "../context/BrowserContext";

function useBrowserShortcuts() {
  const {
    activeTabId,

    createNewTab,
    closeTab,
    reopenClosedTab,

    selectTabByIndex,

    focusAddressBar,

    reloadOrStop,

    goBack,
    goForward,

    openFind,
    closeFind,

    zoomIn,
    zoomOut,
    resetZoom,

    toggleFullscreen,
  } = useBrowser();

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key.toLowerCase();

      const modifierKey = event.ctrlKey || event.metaKey;

      if (modifierKey && !event.altKey && key === "f") {
        event.preventDefault();
        event.stopPropagation();

        openFind();

        return;
      }

      if (event.key === "Escape") {
        closeFind();

        return;
      }

      if (modifierKey && event.shiftKey && key === "t") {
        event.preventDefault();
        event.stopPropagation();

        reopenClosedTab();

        return;
      }

      if (modifierKey && !event.shiftKey && key === "t") {
        event.preventDefault();
        event.stopPropagation();

        createNewTab();

        return;
      }

      if (modifierKey && !event.shiftKey && key === "w") {
        event.preventDefault();
        event.stopPropagation();

        if (activeTabId) {
          closeTab(activeTabId);
        }

        return;
      }

      if (modifierKey && !event.shiftKey && key === "l") {
        event.preventDefault();
        event.stopPropagation();

        focusAddressBar();

        return;
      }

      if (modifierKey && !event.shiftKey && key === "r") {
        event.preventDefault();
        event.stopPropagation();

        reloadOrStop();

        return;
      }

      if (
        modifierKey &&
        !event.altKey &&
        (key === "+" || key === "=" || event.code === "NumpadAdd")
      ) {
        event.preventDefault();
        event.stopPropagation();

        zoomIn();

        return;
      }

      if (
        modifierKey &&
        !event.altKey &&
        (key === "-" || event.code === "NumpadSubtract")
      ) {
        event.preventDefault();
        event.stopPropagation();

        zoomOut();

        return;
      }

      if (modifierKey && !event.altKey && key === "0") {
        event.preventDefault();
        event.stopPropagation();

        resetZoom();

        return;
      }

      if (event.key === "F11") {
        event.preventDefault();
        event.stopPropagation();

        toggleFullscreen();

        return;
      }

      if (event.altKey && !modifierKey && event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();

        goBack();

        return;
      }

      if (event.altKey && !modifierKey && event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();

        goForward();

        return;
      }

      if (
        modifierKey &&
        !event.altKey &&
        !event.shiftKey &&
        /^[1-9]$/.test(event.key)
      ) {
        event.preventDefault();
        event.stopPropagation();

        const keyNumber = Number(event.key);

        selectTabByIndex(keyNumber === 9 ? 8 : keyNumber - 1);

        return;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    activeTabId,

    createNewTab,
    closeTab,
    reopenClosedTab,

    selectTabByIndex,

    focusAddressBar,

    reloadOrStop,

    goBack,
    goForward,

    openFind,
    closeFind,

    zoomIn,
    zoomOut,
    resetZoom,

    toggleFullscreen,
  ]);
}

export default useBrowserShortcuts;
