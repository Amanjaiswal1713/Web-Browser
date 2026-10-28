import { MoreVertical, Plus, Quote, ArrowRight } from "lucide-react";

function HeroSection({
  styles,
  greeting,
  shortcuts = [],
  onOpenShortcut,
  onAddShortcut,
  onEditShortcut,
  onDeleteShortcut,
}) {
  const shortcutColors = [
    "shortcutblue",
    "shortcutpink",
    "shortcutorange",
    "shortcutpurple",
    "shortcutcyan",
    "shortcutrose",
  ];

  const getShortcutLetter = (shortcut) => {
    const name = shortcut?.name?.trim();

    if (!name) {
      return "?";
    }

    return name.charAt(0).toUpperCase();
  };

  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay} />

      <div className={styles.heroContent}>
        <p className={styles.greeting}>{greeting},</p>

        <h1>Explore More</h1>

        <p className={styles.heroSubtitle}>
          A faster, smarter way to discover the web
        </p>

        <div className={styles.shortcutGrid}>
          {shortcuts.map((shortcut, index) => {
            const colorClass = shortcutColors[index % shortcutColors.length];

            return (
              <div key={shortcut.id} className={styles.shortcutWrapper}>
                <button
                  type="button"
                  className={`${styles.shortcutCard} ${styles[colorClass]}`}
                  onClick={() => onOpenShortcut(shortcut)}
                  title={`Open ${shortcut.name}`}
                >
                  <span className={styles.shortcutLetter}>
                    {getShortcutLetter(shortcut)}
                  </span>

                  <span className={styles.shortcutLabel}>{shortcut.name}</span>
                </button>

                <div className={styles.shortcutMenu}>
                  <button
                    type="button"
                    className={styles.shortcutMenuButton}
                    aria-label={`Options for ${shortcut.name}`}
                    title="Shortcut options"
                  >
                    <MoreVertical size={14} />
                  </button>

                  <div className={styles.shortcutActions}>
                    <button
                      type="button"
                      onClick={() => onEditShortcut(shortcut)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      className={styles.deleteShortcutAction}
                      onClick={() => onDeleteShortcut(shortcut.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <button
            type="button"
            className={`${styles.shortcutCard} ${styles.addShortcut}`}
            onClick={onAddShortcut}
            title="Add Shortcut"
          >
            <Plus size={26} />

            <span>Add</span>
          </button>
        </div>
      </div>

      <aside className={styles.quoteCard}>
        <Quote size={27} />

        <blockquote>
          Not all who wander
          <br />
          are lost.
        </blockquote>

        <span className={styles.quoteLine} />

        <p>Explore. Discover. Belong.</p>

        <button type="button" onClick={onAddShortcut}>
          Start exploring
          <ArrowRight size={14} />
        </button>
      </aside>
    </section>
  );
}

export default HeroSection;
