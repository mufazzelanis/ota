import type { Field } from "./admin-schema";

// Registry of page-builder blocks. Each entry drives both the admin form
// (fields) and the defaults used when a block is added. Renderers live in
// components/site/blocks.tsx keyed by the same `type`.

export type BlockDef = { label: string; icon: string; description: string; fields: Field[] };

const heading: Field[] = [
  { key: "eyebrow", label: "Eyebrow", type: "text" },
  { key: "title", label: "Title", type: "text" },
  { key: "subtitle", label: "Subtitle", type: "textarea", wide: true },
];

export const BLOCKS: Record<string, BlockDef> = {
  features: {
    label: "Feature grid",
    icon: "layers",
    description: "Icon cards in 2, 3 or 4 columns",
    fields: [
      ...heading,
      { key: "columns", label: "Columns", type: "select", options: [{ value: "3", label: "3 columns" }, { value: "4", label: "4 columns" }, { value: "2", label: "2 columns" }] },
      {
        key: "items", label: "Features", type: "repeater", wide: true, itemLabel: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "icon", label: "Icon", type: "icon" },
          { key: "text", label: "Text", type: "textarea", wide: true },
        ],
      },
    ],
  },
  stats: {
    label: "Stats band",
    icon: "chart",
    description: "Animated counters on a dark band",
    fields: [
      {
        key: "items", label: "Stats", type: "repeater", wide: true, itemLabel: "label",
        fields: [
          { key: "label", label: "Label", type: "text", wide: true },
          { key: "prefix", label: "Prefix", type: "text" },
          { key: "value", label: "Number", type: "number" },
          { key: "suffix", label: "Suffix", type: "text" },
        ],
      },
    ],
  },
  split: {
    label: "Text + code",
    icon: "code",
    description: "Explanation with bullets beside a live-looking code window",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "text", label: "Text", type: "textarea", wide: true },
      { key: "bullets", label: "Bullets (one per line)", type: "lines", wide: true },
      { key: "codeTitle", label: "Code window title", type: "text" },
      { key: "reverse", label: "Code on the left", type: "boolean" },
      { key: "code", label: "Code (JSON)", type: "code", wide: true },
    ],
  },
  steps: {
    label: "Steps",
    icon: "compass",
    description: "Numbered process with a connecting line",
    fields: [
      ...heading,
      { key: "items", label: "Steps", type: "repeater", wide: true, itemLabel: "title", fields: [{ key: "title", label: "Title", type: "text" }, { key: "text", label: "Text", type: "textarea", wide: true }] },
    ],
  },
  compare: {
    label: "Comparison table",
    icon: "chart",
    description: 'Two-column comparison. Use "yes"/"no" for check and cross.',
    fields: [
      ...heading,
      { key: "usLabel", label: "Your column label", type: "text" },
      { key: "themLabel", label: "Other column label", type: "text" },
      {
        key: "rows", label: "Rows", type: "repeater", wide: true, itemLabel: "label",
        fields: [
          { key: "label", label: "Row", type: "text", wide: true },
          { key: "us", label: "Your value", type: "text" },
          { key: "them", label: "Other value", type: "text" },
        ],
      },
    ],
  },
  coverage: {
    label: "Coverage explorer",
    icon: "globe",
    description: "Region summary cards plus a searchable, filterable list",
    fields: [
      ...heading,
      { key: "searchPlaceholder", label: "Search placeholder", type: "text" },
      {
        key: "regions", label: "Regions", type: "repeater", wide: true, itemLabel: "name",
        fields: [
          { key: "name", label: "Region", type: "text" },
          { key: "value", label: "Headline number", type: "text" },
          { key: "label", label: "Number label", type: "text" },
        ],
      },
      {
        key: "items", label: "Listed items", type: "repeater", wide: true, itemLabel: "name",
        fields: [
          { key: "name", label: "Name", type: "text" },
          { key: "code", label: "Code", type: "text" },
          { key: "region", label: "Region (must match a region name)", type: "text" },
          { key: "meta", label: "Detail", type: "text" },
          { key: "tags", label: "Tags (comma separated)", type: "text", wide: true },
        ],
      },
    ],
  },
  endpoints: {
    label: "API reference (auto)",
    icon: "code",
    description: "Lists every endpoint from your Products automatically",
    fields: [...heading],
  },
  cards: {
    label: "Link cards",
    icon: "map",
    description: "Clickable cards that link to other pages",
    fields: [
      ...heading,
      {
        key: "items", label: "Cards", type: "repeater", wide: true, itemLabel: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "icon", label: "Icon", type: "icon" },
          { key: "href", label: "Link URL", type: "text" },
          { key: "label", label: "Link text", type: "text" },
          { key: "text", label: "Text", type: "textarea", wide: true },
        ],
      },
    ],
  },
  faq: {
    label: "FAQ",
    icon: "support",
    description: "Accordion of questions and answers",
    fields: [
      ...heading,
      { key: "items", label: "Questions", type: "repeater", wide: true, itemLabel: "question", fields: [{ key: "question", label: "Question", type: "text", wide: true }, { key: "answer", label: "Answer", type: "textarea", wide: true }] },
    ],
  },
  timeline: {
    label: "Changelog timeline",
    icon: "trending",
    description: "Dated releases with version tags",
    fields: [
      ...heading,
      {
        key: "items", label: "Entries", type: "repeater", wide: true, itemLabel: "title",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "date", label: "Date", type: "text" },
          { key: "version", label: "Version", type: "text" },
          {
            key: "tag", label: "Tag", type: "select",
            options: [{ value: "New", label: "New" }, { value: "Improved", label: "Improved" }, { value: "Fixed", label: "Fixed" }, { value: "Deprecated", label: "Deprecated" }],
          },
          { key: "text", label: "Text", type: "textarea", wide: true },
        ],
      },
    ],
  },
  status: {
    label: "System status",
    icon: "zap",
    description: "Service health with 60-day uptime bars",
    fields: [
      ...heading,
      {
        key: "items", label: "Services", type: "repeater", wide: true, itemLabel: "name",
        fields: [
          { key: "name", label: "Service", type: "text" },
          {
            key: "status", label: "Status", type: "select",
            options: [{ value: "operational", label: "Operational" }, { value: "degraded", label: "Degraded" }, { value: "outage", label: "Outage" }, { value: "maintenance", label: "Maintenance" }],
          },
          { key: "uptime", label: "Uptime %", type: "number" },
        ],
      },
    ],
  },
  richtext: {
    label: "Text section",
    icon: "layers",
    description: "Heading with paragraphs",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "paragraphs", label: "Paragraphs (one per line)", type: "lines", wide: true },
    ],
  },
  logos: {
    label: "Logo marquee",
    icon: "sparkles",
    description: "Scrolling strip of names",
    fields: [
      { key: "title", label: "Title", type: "text", wide: true },
      { key: "items", label: "Names (one per line)", type: "lines", wide: true },
    ],
  },
  cta: {
    label: "Call to action",
    icon: "rocket",
    description: "Bold closing band with two buttons",
    fields: [
      { key: "title", label: "Title", type: "text", wide: true },
      { key: "text", label: "Text", type: "textarea", wide: true },
      { key: "primary", label: "Primary button", type: "text" },
      { key: "primaryHref", label: "Primary link", type: "text" },
      { key: "secondary", label: "Secondary button", type: "text" },
      { key: "secondaryHref", label: "Secondary link", type: "text" },
    ],
  },
};

export const BLOCK_TYPES = Object.keys(BLOCKS);

export const HERO_FIELDS: Field[] = [
  { key: "eyebrow", label: "Eyebrow", type: "text" },
  { key: "highlight", label: "Highlighted last line", type: "text" },
  { key: "title", label: "Title", type: "text", wide: true },
  { key: "subtitle", label: "Subtitle", type: "textarea", wide: true },
  { key: "primaryLabel", label: "Primary button", type: "text" },
  { key: "primaryHref", label: "Primary link", type: "text" },
  { key: "secondaryLabel", label: "Secondary button", type: "text" },
  { key: "secondaryHref", label: "Secondary link", type: "text" },
  { key: "chips", label: "Trust chips (one per line)", type: "lines", wide: true },
  {
    key: "art", label: "Hero artwork", type: "select",
    options: [{ value: "orbit", label: "Animated orbit" }, { value: "code", label: "Code window" }, { value: "none", label: "None (centered text)" }],
  },
  { key: "codeTitle", label: "Code window title", type: "text" },
  { key: "orbitIcons", label: "Orbit icons (icon names, one per line)", type: "lines", wide: true },
  { key: "code", label: "Code (JSON)", type: "code", wide: true },
];
