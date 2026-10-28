import {
  Backpack,
  Calculator,
  CalendarDays,
  CloudSun,
  Gauge,
  Globe2,
  Heart,
  Languages,
  MapPin,
  Newspaper,
  NotebookText,
  Plane,
  Play,
  Settings,
  ShoppingBag,
  Users,
  Wrench,
} from "lucide-react";

export const sidebarItems = [
  {
    id: "home",
    label: "Home",
    icon: Globe2,
  },
  {
    id: "social",
    label: "Social",
    icon: Heart,
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
];

export const shortcutItems = [
  {
    id: "social",
    label: "Social",
    icon: Users,
    color: "blue",
  },
  {
    id: "videos",
    label: "Videos",
    icon: Play,
    color: "pink",
  },
  {
    id: "shopping",
    label: "Shopping",
    icon: ShoppingBag,
    color: "orange",
  },
  {
    id: "news",
    label: "News",
    icon: Newspaper,
    color: "purple",
  },
  {
    id: "tools",
    label: "Tools",
    icon: Wrench,
    color: "cyan",
  },
  {
    id: "travel",
    label: "Travel",
    icon: Plane,
    color: "rose",
  },
];

export const quickTools = [
  {
    id: "weather",
    label: "Weather",
    icon: CloudSun,
    color: "orange",
  },
  {
    id: "translator",
    label: "Translator",
    icon: Languages,
    color: "purple",
  },
  {
    id: "calculator",
    label: "Calculator",
    icon: Calculator,
    color: "cyan",
  },
  {
    id: "notes",
    label: "Notes",
    icon: NotebookText,
    color: "yellow",
  },
  {
    id: "calendar",
    label: "Calendar",
    icon: CalendarDays,
    color: "pink",
  },
  {
    id: "maps",
    label: "Maps",
    icon: MapPin,
    color: "aqua",
  },
  {
    id: "speed-test",
    label: "Speed Test",
    icon: Gauge,
    color: "violet",
  },
  {
    id: "travel-planner",
    label: "Planner",
    icon: Backpack,
    color: "orange",
  },
];

export const secondaryStories = [
  {
    id: "story-1",
    title: "Global markets show positive growth",
    time: "2h ago",
    color: "blue",
  },
  {
    id: "story-2",
    title: "Space mission reaches new milestone",
    time: "5h ago",
    color: "purple",
  },
  {
    id: "story-3",
    title: "Top travel destinations for 2026",
    time: "1d ago",
    color: "orange",
  },
];
