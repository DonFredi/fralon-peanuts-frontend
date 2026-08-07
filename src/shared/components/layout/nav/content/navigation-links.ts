import { Bell, ClipboardClock, Heart, SettingsIcon, UserIcon } from "lucide-react";

export const profileLinks = [
  { to: "/", label: "Account", icon: UserIcon },
  { to: "/orders", label: "Order history", icon: ClipboardClock },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/help-and-support", label: "Help and support", icon: SettingsIcon },
];
