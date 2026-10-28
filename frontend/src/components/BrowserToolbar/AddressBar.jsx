import { Globe2, Mic, Search, ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useBrowser } from "../../context/BrowserContext";
import SearchEngineSelector from "./SearchEngineSelector";
import styles from "./BrowserToolbar.module.css";

function AddressBar() {
  const {
    activeTab,
    addressValue,
    navigationError,
    setAddressValue,
    setNavigationError,
    navigate,
  } = useBrowser();

  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  useEffect(() => {
    if (!focused) {
      setAddressValue(
        activeTab?.url === "browser://new-tab" ? "" : (activeTab?.url ?? ""),
      );
    }
  }, [activeTab?.url, focused, setAddressValue]);
  useEffect(() => {
    const focusAddressBar = () => {
      inputRef.current?.focus();
      inputRef.current?.select();
    };

    window.addEventListener("safora:focus-address-bar", focusAddressBar);

    return () => {
      window.removeEventListener("safora:focus-address-bar", focusAddressBar);
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await navigate(addressValue);
  };

  const handleFocus = (event) => {
    setFocused(true);
    setNavigationError("");
    event.target.select();
  };

  const handleBlur = () => {
    setFocused(false);
  };

  const isSecurePage = activeTab?.url?.startsWith("https://");

  const isNewTab = activeTab?.url === "browser://new-tab";

  return (
    <div className={styles.addressWrapper}>
      <form
        className={`${styles.addressBar} ${
          navigationError ? styles.addressBarError : ""
        }`}
        onSubmit={handleSubmit}
      >
        <SearchEngineSelector />

        {focused || isNewTab ? (
          <Search className={styles.searchIcon} size={19} />
        ) : isSecurePage ? (
          <ShieldCheck className={styles.secureIcon} size={18} />
        ) : (
          <Globe2 className={styles.searchIcon} size={18} />
        )}

        <input
          ref={inputRef}
          type="text"
          className={styles.addressInput}
          value={addressValue}
          onChange={(event) => {
            setAddressValue(event.target.value);

            if (navigationError) {
              setNavigationError("");
            }
          }}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search or enter URL..."
          spellCheck="false"
          autoComplete="off"
          aria-label="Search or enter address"
        />

        <button
          type="button"
          className={styles.addressAction}
          title="Voice search"
          aria-label="Voice search"
        >
          <Mic size={19} />
        </button>
      </form>

      {navigationError && (
        <span className={styles.navigationError} role="alert">
          {navigationError}
        </span>
      )}
    </div>
  );
}

export default AddressBar;
