import type { TabId } from "../types";

export const NAV_ITEMS: {
  id: TabId;
  label: string;
  icon: "home" | "dashboard" | "investors";
}[] = [
  { id: "analyze", label: "Home", icon: "home" },
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "investors", label: "Investors", icon: "investors" },
];
