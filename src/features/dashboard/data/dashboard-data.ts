export type KpiStat = {
  label: string;
  value: string;
  trend: string;
  highlight: boolean;
  href: string;
};

export type ActivityItem = {
  id: string;
  source: string;
  task: string;
  status: string;
  initials: string;
  color: string;
};

export type ExtractionItem = {
  id: string;
  source: string;
  date: string;
  dot: string;
};

export const KPI_STATS: KpiStat[] = [
  {
    label: "Total Receipts",
    value: "132",
    trend: "Increased from last month",
    highlight: true,
    href: "/dashboard",
  },
  {
    label: "Extracted",
    value: "128",
    trend: "Increased from last month",
    highlight: false,
    href: "/dashboard/extract",
  },
  {
    label: "Needs Review",
    value: "03",
    trend: "Increased from last month",
    highlight: false,
    href: "/dashboard",
  },
  {
    label: "Queued",
    value: "04",
    trend: "On Discuss",
    highlight: false,
    href: "/dashboard",
  },
];

export const ACTIVITY_ITEMS: ActivityItem[] = [
  {
    id: "RCP-2417",
    source: "Warehouse Desk",
    task: "Receipt OCR batch processing",
    status: "Extracted",
    initials: "WD",
    color: "#145d66",
  },
  {
    id: "RCP-2416",
    source: "Field Mobile",
    task: "Mobile capture review flow",
    status: "In Review",
    initials: "FM",
    color: "#7c3aed",
  },
  {
    id: "RCP-2415",
    source: "AP Intake",
    task: "Accounts payable batch pipeline",
    status: "Extracted",
    initials: "AP",
    color: "#0891b2",
  },
  {
    id: "RCP-2414",
    source: "Store Tablet",
    task: "POS terminal receipt processing",
    status: "Queued",
    initials: "ST",
    color: "#d97706",
  },
  {
    id: "RCP-2413",
    source: "Branch Office",
    task: "Branch Office receipt processing",
    status: "Extracted",
    initials: "BO",
    color: "#145d66",
  },
];

export const EXTRACTIONS: ExtractionItem[] = [
  { id: "RCP-2417", source: "Warehouse Desk", date: "Nov 26, 2024", dot: "#145d66" },
  { id: "RCP-2416", source: "Field Mobile", date: "Nov 28, 2024", dot: "#7c3aed" },
  { id: "RCP-2415", source: "AP Intake", date: "Nov 29, 2024", dot: "#0891b2" },
  { id: "RCP-2414", source: "Store Tablet", date: "Dec 2, 2024", dot: "#d97706" },
  { id: "RCP-2413", source: "Branch Office", date: "Dec 6, 2024", dot: "#145d66" },
];
