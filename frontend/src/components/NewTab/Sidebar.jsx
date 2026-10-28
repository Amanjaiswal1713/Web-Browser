import {
  Bookmark,
  Download,
  Home,
  History,
  Newspaper,
  Play,
  Settings,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Users,
  Wrench,
  Plane,
} from "lucide-react";

function Sidebar({ styles, activeItem, onItemChange }) {
  const navigationItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
    },

    {
      id: "social",
      label: "Social",
      icon: Users,
    },

    {
      id: "videos",
      label: "Videos",
      icon: Play,
    },

    {
      id: "shopping",
      label: "Shopping",
      icon: ShoppingBag,
    },

    {
      id: "news",
      label: "News",
      icon: Newspaper,
    },

    {
      id: "tools",
      label: "Tools",
      icon: Wrench,
    },

    {
      id: "travel",
      label: "Travel",
      icon: Plane,
    },

    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },

    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: Bookmark,
    },

    {
      id: "history",
      label: "History",
      icon: History,
    },

    {
      id: "downloads",
      label: "Downloads",
      icon: Download,
    },
  ];

  return (
    <aside className={styles.sidebar}>
      <nav className={styles.sidebarNavigation}>
        {navigationItems.map((item) => {
          const Icon = item.icon;

          const active = activeItem === item.id;

          return (
            <button
              key={item.id}
              type="button"
              className={`${styles.sidebarItem} ${
                active ? styles.activeSidebarItem : ""
              }`}
              onClick={() => onItemChange(item.id)}
            >
              <span className={styles.sidebarIcon}>
                <Icon size={17} />
              </span>

              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className={styles.customizeButton}
        onClick={() => onItemChange("settings")}
      >
        <span className={styles.customizeIcon}>
          <SlidersHorizontal size={18} />
        </span>

        <span>
          <strong>Customize</strong>

          <small>Your browser</small>
        </span>
      </button>
    </aside>
  );
}

export default Sidebar;
