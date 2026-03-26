import { Bell, Globe, KeyRound, Moon, Palette, ShieldCheck, Sliders, UserCog } from "lucide-react";

export const SETTING_SECTIONS = [
  {
    title: "Account",
    items: [
      {
        icon: UserCog,
        label: "Account preferences",
        description: "Manage your display name, email, and avatar.",
      },
      {
        icon: KeyRound,
        label: "Password & authentication",
        description: "Change your password and configure two-factor authentication.",
      },
      {
        icon: ShieldCheck,
        label: "Privacy & security",
        description: "Control who can see your activity and manage active sessions.",
      },
    ],
  },
  {
    title: "Appearance",
    items: [
      {
        icon: Palette,
        label: "Theme",
        description:
          "Switch between light and dark mode. Use the sidebar toggle for a quick change.",
      },
      {
        icon: Globe,
        label: "Language & region",
        description: "Set your preferred language, date format, and timezone.",
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        icon: Bell,
        label: "Email notifications",
        description: "Choose which events trigger an email to your inbox.",
      },
      {
        icon: Moon,
        label: "Do not disturb",
        description: "Set quiet hours to pause non-critical notifications.",
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        icon: Sliders,
        label: "OCR pipeline defaults",
        description:
          "Configure default processing profiles, confidence thresholds, and output formats.",
      },
    ],
  },
];
