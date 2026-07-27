import { Home, LayoutDashboard, type LucideIcon } from "lucide-react";

export type NavLink = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export const NAV_LINKS: NavLink[] = [
  { label: "Home", href: "/", icon: Home },
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
];
