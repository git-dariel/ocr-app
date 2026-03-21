import {
  CalendarDays,
  CheckCircle2,
  Clock,
  FileText,
  Mail,
  MapPin,
  ShieldCheck,
  User,
} from "lucide-react";

export type ProfileStat = {
  label: string;
  value: string;
  trend: string;
  highlight: boolean;
};

export type InfoRowItem = {
  icon: React.ElementType;
  label: string;
  value: string;
  badge?: string;
};

export type RecentActivityItem = {
  id: string;
  label: string;
  date: string;
  color: string;
};

export const PROFILE_STATS: ProfileStat[] = [
  { label: "Total Extractions", value: "132", trend: "Increased from last month", highlight: true },
  { label: "Avg. OCR Time", value: "1.4s", trend: "Faster than last month", highlight: false },
  { label: "Success Rate", value: "97%", trend: "Consistent accuracy", highlight: false },
  { label: "Days Active", value: "42", trend: "Since Jan 8, 2026", highlight: false },
];

export const PERSONAL_INFO: InfoRowItem[] = [
  { icon: User, label: "Full name", value: "Dariel M." },
  { icon: Mail, label: "Email address", value: "dariel@scant.app" },
  { icon: MapPin, label: "Location", value: "Philippines" },
  { icon: FileText, label: "Role", value: "Admin" },
];

export const ACCOUNT_INFO: InfoRowItem[] = [
  { icon: CalendarDays, label: "Member since", value: "January 8, 2026" },
  { icon: Clock, label: "Last active", value: "Today at 9:41 AM" },
  { icon: CheckCircle2, label: "Account status", value: "Active", badge: "active" },
  { icon: ShieldCheck, label: "Two-factor auth", value: "Enabled", badge: "enabled" },
];

export const RECENT_ACTIVITY: RecentActivityItem[] = [
  { id: "RCP-2417", label: "Warehouse Desk batch — 34 receipts", date: "Nov 26, 2024", color: "#145d66" },
  { id: "RCP-2416", label: "Field Mobile capture review", date: "Nov 28, 2024", color: "#7c3aed" },
  { id: "RCP-2415", label: "AP Intake pipeline — 18 receipts", date: "Nov 29, 2024", color: "#0891b2" },
  { id: "RCP-2414", label: "Store Tablet POS processing", date: "Dec 2, 2024", color: "#d97706" },
  { id: "RCP-2413", label: "Branch Office batch run", date: "Dec 6, 2024", color: "#145d66" },
];
