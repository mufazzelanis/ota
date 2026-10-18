import type { ContentKey } from "./types";

export type FieldType =
  | "text" | "textarea" | "code" | "number" | "boolean" | "icon" | "tone" | "lines" | "slug" | "rating"
  | "select" | "repeater";

export type Field = {
  key: string; // dotted paths allowed for objects, e.g. "benefits.title"
  label: string;
  type: FieldType;
  help?: string;
  wide?: boolean;
  from?: string; // for slug: source field
  options?: { value: string; label: string }[]; // for select
  fields?: Field[]; // for repeater: fields of each item
  itemLabel?: string; // for repeater: which sub-field names an item
};

type Base = { key: ContentKey; label: string; icon: string; group: string; description: string };

export type ObjectSection = Base & { kind: "object"; fields: Field[] };
export type CollectionSection = Base & {
  kind: "collection";
  fields: Field[];
  titleKey: string;
  subtitleKey?: string;
  iconKey?: string;
};

export type AdminSection = ObjectSection | CollectionSection;

const visible: Field = { key: "visible", label: "Visible on site", type: "boolean" };

const headingFields = (id: string, name: string): Field[] => [
  { key: `${id}.eyebrow`, label: `${name} · eyebrow`, type: "text" },
  { key: `${id}.title`, label: `${name} · title`, type: "text", wide: true },
  { key: `${id}.subtitle`, label: `${name} · subtitle`, type: "textarea", wide: true },
];

export const ADMIN_SECTIONS: AdminSection[] = [
  {
    key: "navigation", kind: "collection", label: "Navigation", icon: "compass", group: "Site Builder",
    description: "Header menu. Dropdowns also become footer columns. Use 'Products' type for the auto mega menu.",
    titleKey: "label", subtitleKey: "href",
    fields: [
      { key: "label", label: "Label", type: "text" },
      {
        key: "type", label: "Type", type: "select",
        options: [
          { value: "link", label: "Link" },
          { value: "dropdown", label: "Dropdown menu" },
          { value: "products", label: "Products mega menu (automatic)" },
        ],
      },
      { key: "href", label: "Link URL", type: "text", help: "For links, e.g. /hotels or /#faq. Dropdowns ignore this." },
      { key: "badge", label: "Badge (optional)", type: "text", help: 'Small pill such as "New"' },
      { key: "highlight", label: "Highlight in accent color", type: "boolean" },
      visible,
      {
        key: "children", label: "Dropdown items", type: "repeater", wide: true, itemLabel: "label",
        help: "Only used when Type is Dropdown menu.",
        fields: [
          { key: "label", label: "Label", type: "text" },
          { key: "href", label: "Link URL", type: "text" },
          { key: "icon", label: "Icon", type: "icon" },
          { key: "description", label: "Short description", type: "text" },
        ],
      },
    ],
  },
  {
    key: "settings", kind: "object", label: "Brand & Contact", icon: "briefcase", group: "General",
    description: "Brand name, logo mark, contact details and social links used across the site.",
    fields: [
      { key: "brandName", label: "Brand name", type: "text" },
      { key: "logoText", label: "Logo mark (2–3 letters)", type: "text" },
      { key: "tagline", label: "Tagline (browser title)", type: "text", wide: true },
      { key: "description", label: "Short description (footer & SEO)", type: "textarea", wide: true },
      { key: "ctaLabel", label: "Header button label", type: "text" },
      { key: "company", label: "Legal company name", type: "text" },
      { key: "email", label: "Email", type: "text" },
      { key: "phone", label: "Phone", type: "text" },
      { key: "whatsapp", label: "WhatsApp number", type: "text", help: "With country code, e.g. +880 1700-000000" },
      { key: "whatsappEnabled", label: "Show floating WhatsApp button", type: "boolean" },
      { key: "whatsappAgent", label: "WhatsApp chat name", type: "text" },
      { key: "whatsappGreeting", label: "WhatsApp greeting bubble", type: "textarea", wide: true },
      { key: "whatsappMessage", label: "Pre-filled message", type: "textarea", wide: true, help: "Text the visitor's WhatsApp opens with" },
      { key: "address", label: "Office address", type: "textarea" },
      { key: "facebook", label: "Facebook URL", type: "text" },
      { key: "linkedin", label: "LinkedIn URL", type: "text" },
      { key: "youtube", label: "YouTube URL", type: "text" },
      { key: "footerNote", label: "Footer note", type: "text" },
    ],
  },
  {
    key: "hero", kind: "object", label: "Hero", icon: "rocket", group: "Homepage",
    description: "The first screen visitors see.",
    fields: [
      { key: "badge", label: "Badge text", type: "text", wide: true },
      { key: "titleLines", label: "Headline lines (one per line)", type: "lines", wide: true },
      { key: "highlight", label: "Highlighted last line", type: "text" },
      { key: "videoLabel", label: "Video button label", type: "text" },
      { key: "subtitle", label: "Subtitle", type: "textarea", wide: true },
      { key: "primaryCta", label: "Primary button", type: "text" },
      { key: "secondaryCta", label: "Secondary button", type: "text" },
      { key: "trustPoints", label: "Trust points (one per line)", type: "lines", wide: true },
    ],
  },
  {
    key: "playground", kind: "collection", label: "API Playground", icon: "code", group: "Homepage",
    description: "Tabs in the interactive hero console. Responses animate after the given latency.",
    titleKey: "label", subtitleKey: "endpoint", iconKey: "icon",
    fields: [
      { key: "label", label: "Tab label", type: "text" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "method", label: "HTTP method", type: "text" },
      { key: "endpoint", label: "Endpoint", type: "text" },
      { key: "latency", label: "Simulated latency (ms)", type: "number" },
      visible,
      { key: "request", label: "Request JSON", type: "code", wide: true },
      { key: "response", label: "Response JSON", type: "code", wide: true },
    ],
  },
  {
    key: "stats", kind: "collection", label: "Stats", icon: "chart", group: "Homepage",
    description: "Animated counters under the hero.",
    titleKey: "label", subtitleKey: "value",
    fields: [
      { key: "label", label: "Label", type: "text", wide: true },
      { key: "prefix", label: "Prefix", type: "text" },
      { key: "value", label: "Number", type: "number" },
      { key: "suffix", label: "Suffix", type: "text" },
      visible,
    ],
  },
  {
    key: "partners", kind: "collection", label: "Supply Marquee", icon: "globe", group: "Homepage",
    description: "Scrolling list of connected supply sources.",
    titleKey: "name",
    fields: [{ key: "name", label: "Name", type: "text", wide: true }, visible],
  },
  {
    key: "announcement", kind: "object", label: "Announcement", icon: "sparkles", group: "Homepage",
    description: "Highlighted news band. Turn it off when there's nothing to announce.",
    fields: [
      { key: "enabled", label: "Show announcement", type: "boolean" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text", wide: true },
      { key: "text", label: "Text", type: "textarea", wide: true },
      { key: "links", label: "Link chips (one per line)", type: "lines", wide: true },
    ],
  },
  {
    key: "about", kind: "object", label: "About", icon: "users", group: "Homepage",
    description: "Who you are, in two short paragraphs.",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text", wide: true },
      { key: "paragraphs", label: "Paragraphs (one per line)", type: "lines", wide: true },
    ],
  },
  {
    key: "benefits", kind: "collection", label: "Benefits", icon: "zap", group: "Homepage",
    description: "Four quick reasons to choose you.",
    titleKey: "title", subtitleKey: "text", iconKey: "icon",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "text", label: "Text", type: "textarea", wide: true },
      visible,
    ],
  },
  {
    key: "products", kind: "collection", label: "Products", icon: "layers", group: "Catalog",
    description: "Every product gets a card on the homepage and its own detail page.",
    titleKey: "name", subtitleKey: "slug", iconKey: "icon",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "URL slug", type: "slug", from: "name", help: "Leave empty to generate from the name" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "tone", label: "Color tone", type: "tone" },
      { key: "short", label: "Card description", type: "textarea", wide: true },
      { key: "description", label: "Detail page description", type: "textarea", wide: true },
      { key: "features", label: "Features (one per line)", type: "lines", wide: true },
      { key: "endpoints", label: "Endpoints (one per line, e.g. POST /v1/x)", type: "lines", wide: true },
      visible,
    ],
  },
  {
    key: "useCases", kind: "collection", label: "Use Cases", icon: "briefcase", group: "Catalog",
    description: "Who the platform is built for.",
    titleKey: "title", subtitleKey: "text", iconKey: "icon",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "tone", label: "Color tone", type: "tone" },
      visible,
      { key: "text", label: "Text", type: "textarea", wide: true },
    ],
  },
  {
    key: "reasons", kind: "collection", label: "Why Us", icon: "star", group: "Homepage",
    description: "Reasons listed beside the comparison table.",
    titleKey: "title", subtitleKey: "text", iconKey: "icon",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "icon", label: "Icon", type: "icon" },
      { key: "text", label: "Text", type: "textarea", wide: true },
      visible,
    ],
  },
  {
    key: "compare", kind: "collection", label: "Comparison Table", icon: "chart", group: "Homepage",
    description: 'Use "yes" or "no" to show a check or cross icon.',
    titleKey: "label", subtitleKey: "us",
    fields: [
      { key: "label", label: "Row label", type: "text", wide: true },
      { key: "us", label: "Your value", type: "text" },
      { key: "them", label: "Competitor value", type: "text" },
      visible,
    ],
  },
  {
    key: "steps", kind: "collection", label: "How It Works", icon: "compass", group: "Homepage",
    description: "Numbered onboarding steps.",
    titleKey: "title", subtitleKey: "text",
    fields: [
      { key: "title", label: "Title", type: "text" },
      visible,
      { key: "text", label: "Text", type: "textarea", wide: true },
    ],
  },
  {
    key: "testimonials", kind: "collection", label: "Testimonials", icon: "users", group: "Homepage",
    description: "Customer quotes in the scrolling wall.",
    titleKey: "name", subtitleKey: "company",
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "role", label: "Role", type: "text" },
      { key: "company", label: "Company", type: "text" },
      { key: "rating", label: "Rating", type: "rating" },
      { key: "quote", label: "Quote", type: "textarea", wide: true },
      visible,
    ],
  },
  {
    key: "faqs", kind: "collection", label: "FAQ", icon: "support", group: "Homepage",
    description: "Questions and answers.",
    titleKey: "question",
    fields: [
      { key: "question", label: "Question", type: "text", wide: true },
      { key: "answer", label: "Answer", type: "textarea", wide: true },
      visible,
    ],
  },
  {
    key: "resources", kind: "collection", label: "Resources", icon: "map", group: "Homepage",
    description: "Guides and playbook links.",
    titleKey: "title", subtitleKey: "tag",
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "tag", label: "Tag", type: "text" },
      { key: "text", label: "Text", type: "textarea", wide: true },
      visible,
    ],
  },
  {
    key: "cta", kind: "object", label: "Final CTA", icon: "rocket", group: "Homepage",
    description: "The closing call to action band.",
    fields: [
      { key: "title", label: "Title", type: "text", wide: true },
      { key: "text", label: "Text", type: "textarea", wide: true },
      { key: "primary", label: "Primary button", type: "text" },
      { key: "secondary", label: "Secondary button", type: "text" },
    ],
  },
  {
    key: "headings", kind: "object", label: "Section Headings", icon: "layers", group: "Homepage",
    description: "Eyebrow, title and subtitle for each homepage section.",
    fields: [
      ...headingFields("benefits", "Benefits"),
      ...headingFields("products", "Products"),
      ...headingFields("usecases", "Use cases"),
      ...headingFields("why", "Why us"),
      ...headingFields("steps", "How it works"),
      ...headingFields("testimonials", "Testimonials"),
      ...headingFields("faq", "FAQ"),
      ...headingFields("resources", "Resources"),
      { key: "partners.title", label: "Supply marquee · title", type: "text", wide: true },
    ],
  },
];

export const findSection = (key: string) => ADMIN_SECTIONS.find((s) => s.key === key);
