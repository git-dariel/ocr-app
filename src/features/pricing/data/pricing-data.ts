export const PLANS = [
  {
    name: "Starter",
    eyebrow: "For individuals",
    price: "Free",
    priceNote: "forever",
    description:
      "Everything you need to start scanning and reviewing receipts in a single workspace.",
    cta: { label: "Get started", href: "/sign-up", primary: false },
    features: [
      { label: "Up to 50 extractions / month", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Team members", included: false },
      { label: "Priority processing", included: false },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Pro",
    eyebrow: "Most popular",
    price: "$19",
    priceNote: "per month",
    description:
      "For growing teams that need higher volume, team collaboration, and faster processing queues.",
    cta: { label: "Start free trial", href: "/sign-up", primary: true },
    highlight: true,
    features: [
      { label: "Up to 2 000 extractions / month", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Up to 5 team members", included: true },
      { label: "Priority processing", included: true },
      { label: "API access", included: false },
    ],
  },
  {
    name: "Enterprise",
    eyebrow: "For large teams",
    price: "Custom",
    priceNote: "contact us",
    description:
      "Unlimited volume, dedicated support, API access, and custom integrations for receipt-heavy operations.",
    cta: { label: "Contact sales", href: "/sign-up", primary: false },
    features: [
      { label: "Unlimited extractions", included: true },
      { label: "Camera + file upload", included: true },
      { label: "Image preprocessing pipeline", included: true },
      { label: "Raw OCR line review", included: true },
      { label: "Google Vision provider", included: true },
      { label: "Unlimited team members", included: true },
      { label: "Priority processing", included: true },
      { label: "API access", included: true },
    ],
  },
];

export const FAQ_ITEMS = [
  {
    q: "What counts as an extraction?",
    a: "Each time you submit a receipt image through the OCR workspace and receive a result counts as one extraction, regardless of page count.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. You can upgrade or downgrade your plan at any time from your account settings. Billing is prorated for the current cycle.",
  },
  {
    q: "What image formats are supported?",
    a: "The workspace accepts JPEG, PNG, WEBP, and HEIC files. Camera capture uses JPEG natively across supported browsers.",
  },
  {
    q: "Is Google Vision required?",
    a: "The current pipeline routes through Google Vision OCR for best-in-class accuracy on receipt text. Additional providers are on the roadmap.",
  },
];
